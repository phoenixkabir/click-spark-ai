from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import warm_up, score_concept


@asynccontextmanager
async def lifespan(app: FastAPI):
    warm_up()
    yield


app = FastAPI(title="TRIBE v2 Scoring Service", lifespan=lifespan)


class ScoreRequest(BaseModel):
    text: str
    image_description: str
    video_script: str
    require_gpu: bool = False


class ScoreResponse(BaseModel):
    reward_score: int
    attention_score: int
    emotion_score: int
    memory_score: int
    overall_score: int


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/score", response_model=ScoreResponse)
def score(req: ScoreRequest):
    try:
        import torch
        if req.require_gpu and not torch.cuda.is_available():
            raise HTTPException(status_code=400, detail="GPU not available")
        result = score_concept(req.text, req.image_description, req.video_script)
        return ScoreResponse(
            reward_score=result["reward_score"],
            attention_score=result["attention_score"],
            emotion_score=result["emotion_score"],
            memory_score=result["memory_score"],
            overall_score=result["overall_score"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
