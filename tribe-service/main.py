from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from model import score_concept

app = FastAPI(title="TRIBE v2 Scoring Service")

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
