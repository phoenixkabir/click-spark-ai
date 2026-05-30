"""
TRIBE v2 scoring service.

GPU: uses real TribeModel brain encoding.
CPU: uses sentence-transformer cosine similarity against neuroscience-anchored
     phrase sets, normalized to 0-100. Four dimensions match real TRIBE v2
     cortical regions: Reward (OFC), Attention (frontal/parietal),
     Emotion (insula/cingulate), Memory (parahippocampal).
"""

import threading
import numpy as np
import torch

_model_lock = threading.Lock()
_tribe_model = None
_embedder = None
_embedder_lock = threading.Lock()

# Each list is embedded separately; dimension score = mean cosine similarity
# with concept embedding, then min-max normalized via range [0.15, 0.65].
ANCHORS = {
    "reward": [
        "surprising unexpected twist shocking reward",
        "exciting tempting desire craving want",
        "funny humor comedy playful laugh",
        "novelty curiosity intrigue discovery wonder",
        "sensory pleasure vivid taste smell feel",
    ],
    "attention": [
        "movement action dynamic fast energy motion",
        "close-up face eyes direct gaze portrait",
        "bright contrast vivid bold color pop",
        "unexpected visual change cut jump surprise",
        "human body gesture expression performance",
    ],
    "emotion": [
        "human connection belonging together community love",
        "empathy vulnerability authentic real honest raw",
        "fear danger tension suspense risk stakes",
        "joy celebration triumph pride achievement",
        "nostalgic memory personal meaning sentimental",
    ],
    "memory": [
        "story narrative arc beginning middle end",
        "callback repeat motif anchor bookend",
        "unique distinctive memorable unforgettable brand",
        "rhyme rhythm pattern repetition cadence",
        "concrete specific detail image not abstract",
    ],
}

OVERALL_WEIGHTS = {"reward": 0.30, "attention": 0.25, "emotion": 0.25, "memory": 0.20}
# Empirical normalization range for sentence-transformer cosine similarity.
# Short marketing copy vs multi-word anchor phrases clusters in 0.05–0.35,
# not the 0.15–0.65 range typical of longer documents.
_SIM_MIN = 0.05
_SIM_MAX = 0.35


def _get_embedder():
    global _embedder
    if _embedder is not None:
        return _embedder
    with _embedder_lock:
        if _embedder is not None:
            return _embedder
        from sentence_transformers import SentenceTransformer
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedder


def _normalize(sim: float) -> float:
    normalized = (sim - _SIM_MIN) / (_SIM_MAX - _SIM_MIN)
    return float(np.clip(normalized * 100, 0, 100))


def _semantic_score_all(text: str) -> dict:
    model = _get_embedder()
    query_emb = model.encode([text], normalize_embeddings=True)[0]

    scores = {}
    for dim, anchors in ANCHORS.items():
        anchor_embs = model.encode(anchors, normalize_embeddings=True)
        sims = anchor_embs @ query_emb
        scores[dim] = _normalize(float(np.mean(sims)))

    overall = sum(scores[d] * w for d, w in OVERALL_WEIGHTS.items())
    scores["overall"] = float(overall)
    return scores


def _tribe_score_all(text: str, image_description: str, video_script: str) -> dict:
    import tempfile
    global _tribe_model
    if _tribe_model is None:
        with _model_lock:
            if _tribe_model is None:
                from tribev2 import TribeModel
                _tribe_model = TribeModel.from_pretrained("facebook/tribev2")

    model = _tribe_model
    combined_text = f"{text}\n\n{video_script}"

    with tempfile.NamedTemporaryFile(suffix=".txt", mode="w", delete=False) as f:
        f.write(combined_text)
        text_file = f.name

    with tempfile.NamedTemporaryFile(suffix=".txt", mode="w", delete=False) as f:
        f.write(image_description)
        visual_file = f.name

    def _extract_dimension(preds: np.ndarray, region_slice: slice) -> float:
        region = preds[:, region_slice]
        raw = float(np.mean(np.abs(region)))
        # Empirical brain activation range
        normalized = (raw - 0.02) / (0.18 - 0.02)
        return float(np.clip(normalized * 100, 0, 100))

    with torch.inference_mode():
        te = model.get_events_dataframe(text_path=text_file)
        tp, _ = model.predict(te, verbose=False)
        ve = model.get_events_dataframe(text_path=visual_file)
        vp, _ = model.predict(ve, verbose=False)

    # fsaverage5 region mapping (approximate cortical parcellation)
    reward     = (_extract_dimension(tp, slice(0, 500)) + _extract_dimension(vp, slice(0, 500))) / 2
    attention  = (_extract_dimension(tp, slice(500, 2000)) + _extract_dimension(vp, slice(500, 2000))) / 2
    emotion    = (_extract_dimension(tp, slice(2000, 4000)) + _extract_dimension(vp, slice(2000, 4000))) / 2
    memory     = (_extract_dimension(tp, slice(4000, 6000)) + _extract_dimension(vp, slice(4000, 6000))) / 2
    overall    = 0.30 * reward + 0.25 * attention + 0.25 * emotion + 0.20 * memory

    return {
        "reward": round(reward),
        "attention": round(attention),
        "emotion": round(emotion),
        "memory": round(memory),
        "overall": round(overall),
    }


def warm_up():
    if torch.cuda.is_available():
        # GPU: warm up TRIBE model with a dummy call (loads weights into VRAM)
        try:
            _tribe_score_all("test hook", "test visual", "test script")
        except Exception:
            pass
    else:
        _get_embedder()


def score_concept(text: str, image_description: str, video_script: str) -> dict:
    if torch.cuda.is_available():
        raw = _tribe_score_all(text, image_description, video_script)
        return {
            "reward_score": raw["reward"],
            "attention_score": raw["attention"],
            "emotion_score": raw["emotion"],
            "memory_score": raw["memory"],
            "overall_score": raw["overall"],
        }

    # CPU path: semantic approximation
    combined = f"{text} {video_script}"
    text_scores = _semantic_score_all(combined)
    visual_scores = _semantic_score_all(image_description)

    return {
        "reward_score":    round(0.6 * text_scores["reward"]    + 0.4 * visual_scores["reward"]),
        "attention_score": round(0.6 * text_scores["attention"] + 0.4 * visual_scores["attention"]),
        "emotion_score":   round(0.6 * text_scores["emotion"]   + 0.4 * visual_scores["emotion"]),
        "memory_score":    round(0.6 * text_scores["memory"]    + 0.4 * visual_scores["memory"]),
        "overall_score":   round(0.6 * text_scores["overall"]   + 0.4 * visual_scores["overall"]),
        "mode": "semantic",
    }
