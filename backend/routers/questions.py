from fastapi import APIRouter, HTTPException
from models.schemas import QuestionRequest, QuestionResponse
from services.ai import generate_question

router = APIRouter()

TOPIC_MAP = {
    "SDE": ["arrays", "linked lists", "trees", "dynamic programming", "system design", "behavioral"],
    "Data Scientist": ["statistics", "machine learning", "SQL", "python", "model evaluation", "behavioral"],
    "PM": ["product sense", "metrics", "prioritization", "behavioral", "estimation"]
}

@router.post("/generate-question", response_model=QuestionResponse)
async def get_question(req: QuestionRequest):
    try:
        result = generate_question(req.role, req.difficulty, req.topic)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/topics/{role}")
def get_topics(role: str):
    return TOPIC_MAP.get(role, [])