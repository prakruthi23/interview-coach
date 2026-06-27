from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.ai import evaluate_answer

router = APIRouter()

class EvaluateRequest(BaseModel):
    question: str
    expected_points: List[str]
    rubric: dict
    user_answer: str

@router.post("/evaluate-answer")
async def evaluate(req: EvaluateRequest):
    try:
        return evaluate_answer(
            req.question, req.expected_points,
            req.rubric, req.user_answer
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))