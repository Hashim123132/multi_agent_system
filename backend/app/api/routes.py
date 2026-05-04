from fastapi import APIRouter
from pydantic import BaseModel

from backend.app.services.pipeline import run_pipeline

router = APIRouter()

class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(req: ChatRequest):
    result = run_pipeline(req.message)
    return result