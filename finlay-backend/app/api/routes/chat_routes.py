from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...agents.qbit_agent import QbitAgent

router = APIRouter()
qbit = QbitAgent()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    probability: str = None
    reasoning: str = None

@router.post("/", response_model=dict)
async def chat_endpoint(request: ChatRequest):
    try:
        reply = await qbit.process_message(request.message, request.user_id)
        return reply
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
