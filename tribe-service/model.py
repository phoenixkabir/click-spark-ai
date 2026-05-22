import threading
import numpy as np
import torch

_model = None
_model_lock = threading.Lock()


def load_model():
    global _model
    if _model is not None:
        return _model
    with _model_lock:
        # Double-checked locking: re-check after acquiring lock
        if _model is not None:
            return _model
        from tribev2 import TRIBEv2
        _model = TRIBEv2.from_pretrained("facebook/tribev2")
        _model.eval()
        if torch.cuda.is_available():
            _model = _model.cuda()
    return _model


def compute_attention_score(activations: np.ndarray) -> float:
    # Use frontal cortex region (indices 0-2000 on fsaverage5 mesh)
    # Higher activation amplitude = more attentional engagement
    frontal = activations[:2000]
    raw = float(np.mean(np.abs(frontal)))
    # Normalize: empirical range 0.02 (low) to 0.18 (high engagement)
    normalized = (raw - 0.02) / (0.18 - 0.02)
    return float(np.clip(normalized * 100, 0, 100))


def score_concept(text: str, image_description: str, video_script: str) -> dict:
    model = load_model()
    with torch.no_grad():
        text_activations = model.predict_text(text + " " + video_script)
        text_score = compute_attention_score(text_activations.cpu().numpy())

        # Image descriptions are passed as text — TRIBE v2 text pathway scores
        # the linguistic content of the visual concept
        visual_activations = model.predict_text(image_description)
        visual_score = compute_attention_score(visual_activations.cpu().numpy())

        combined = round(0.6 * text_score + 0.4 * visual_score)

    return {
        "text_score": round(text_score),
        "visual_score": round(visual_score),
        "combined_score": combined,
    }
