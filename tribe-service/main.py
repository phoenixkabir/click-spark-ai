from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import load_model, score_concept


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()  # warm up on startup — avoids cold-start timeout on first request
    yield


app = FastAPI(title="TRIBE v2 Scoring Service", lifespan=lifespan)

class ScoreRequest(BaseModel):
    text: str
    image_description: str
    video_script: str

class ScoreResponse(BaseModel):
    text_score: int
    visual_score: int
    combined_score: int

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/score", response_model=ScoreResponse)
def score(req: ScoreRequest):
    try:
        result = score_concept(req.text, req.image_description, req.video_script)
        return ScoreResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
