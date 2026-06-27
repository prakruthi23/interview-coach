from pydantic import BaseModel
from typing import List

class QuestionRequest(BaseModel):
    role: str
    difficulty: str
    topic: str

class Rubric(BaseModel):
    excellent: str
    good: str
    needs_work: str

class QuestionResponse(BaseModel):
    question: str
    topic: str
    difficulty: str
    expected_points: List[str]
    rubric: Rubric
    time_hint_minutes: int