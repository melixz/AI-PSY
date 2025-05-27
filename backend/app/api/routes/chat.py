from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.vectors.vector import get_filtered_retriever
from app.vectors.agent import process_user_input, store_dialog_message
from app.vectors.multi_direction_chain import multi_direction_chain

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post(
    "/ask",
    response_model=ChatResponse,
    summary="Обработка запроса общего характера",
    description="Эта ручка принимает общий запрос от пользователя и возвращает развернутый ответ. Использует инструменты, если это необходимо.",
)
async def ask_rag(request: ChatRequest):
    try:
        user_question = request.question.strip()
        result = process_user_input(user_question)
        store_dialog_message(user_question, result)
        return ChatResponse(answer=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/ask_cbt",
    response_model=ChatResponse,
    summary="Запрос в направлении КПТ",
    description="Эта ручка предназначена для обработки запросов с использованием подхода когнитивно-поведенческой терапии (КПТ).",
)
async def ask_cbt(request: ChatRequest, problem: str = None):
    return await _handle_specialized_request("cbt", request, problem)


@router.post(
    "/ask_gestalt",
    response_model=ChatResponse,
    summary="Запрос в направлении гештальт-терапии",
    description="Эта ручка обрабатывает запросы с применением подхода гештальт-терапии.",
)
async def ask_gestalt(request: ChatRequest, problem: str = None):
    return await _handle_specialized_request("gestalt", request, problem)


@router.post(
    "/ask_psychoanalysis",
    response_model=ChatResponse,
    summary="Запрос в направлении психоанализа",
    description="Эта ручка обрабатывает запросы с использованием принципов психоанализа.",
)
async def ask_psychoanalysis(request: ChatRequest, problem: str = None):
    return await _handle_specialized_request("psychoanalysis", request, problem)


@router.post(
    "/ask_multi_direction",
    response_model=ChatResponse,
    summary="Запрос с мульти-направленным ответом",
    description="Эта ручка обрабатывает запрос пользователя и возвращает ответ с трёх подходов одновременно.",
)
async def ask_multi_direction(request: ChatRequest):
    try:
        user_question = request.question.strip()
        result = multi_direction_chain.invoke({"user_query": user_question})
        store_dialog_message(user_question, result)
        return ChatResponse(answer=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def _handle_specialized_request(
    direction: str, request: ChatRequest, problem: str = None
):
    try:
        retriever = get_filtered_retriever(direction=direction, problem=problem)
        user_question = request.question.strip()
        docs = retriever.invoke(user_question)
        if docs:
            context = "\n".join([doc.page_content for doc in docs])
            full_prompt = f"{context}\n\n{user_question}"
            result = process_user_input(full_prompt)
        else:
            result = process_user_input(user_question)
        store_dialog_message(user_question, result)
        return ChatResponse(answer=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
