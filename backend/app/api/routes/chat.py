from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.vectors.vector import qa_chain

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask", response_model=ChatResponse)
async def ask_chat(request: ChatRequest):
    try:
        response = await qa_chain.ainvoke({"query": request.question})
        answer = response.get("result", "Ответ не найден")
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")
