from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.vectors.vector import get_filtered_retriever
from app.prompts.psy_directions.direction_prompts import get_direction_prompt
from app.prompts.psy_problems.problem_prompts import get_problem_prompt
from app.vectors.agent import agent_executor, memory, store_dialog_message
from app.vectors.multi_direction_chain import multi_direction_chain

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask", response_model=ChatResponse)
async def ask_rag(request: ChatRequest):
    try:
        retriever = get_filtered_retriever()
        docs = retriever.invoke(request.question)
        context = (
            "\n".join([doc.page_content for doc in docs]) if docs else "Общий контекст."
        )
        response_text = _create_prompt_with_context(
            "Общий виртуальный психолог.", context, request.question
        )
        memory.chat_memory.add_user_message(response_text)
        result = agent_executor.invoke({"input": response_text})
        answer = result["output"]
        memory.chat_memory.add_ai_message(answer)
        store_dialog_message(request.question, answer)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask_cbt", response_model=ChatResponse)
async def ask_cbt(request: ChatRequest, problem: str = None):
    return await _handle_specialized_request("cbt", request, problem)


@router.post("/ask_gestalt", response_model=ChatResponse)
async def ask_gestalt(request: ChatRequest, problem: str = None):
    return await _handle_specialized_request("gestalt", request, problem)


@router.post("/ask_psychoanalysis", response_model=ChatResponse)
async def ask_psychoanalysis(request: ChatRequest, problem: str = None):
    return await _handle_specialized_request("psychoanalysis", request, problem)


@router.post("/ask_multi_direction", response_model=ChatResponse)
async def ask_multi_direction(request: ChatRequest):
    try:
        result = multi_direction_chain.invoke({"user_query": request.question})
        store_dialog_message(request.question, result)
        return ChatResponse(answer=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def _handle_specialized_request(
    direction: str, request: ChatRequest, problem: str = None
):
    try:
        direction_prompt = get_direction_prompt(direction)
        problem_prompt = get_problem_prompt(problem) if problem else None
        retriever = get_filtered_retriever(direction=direction, problem=problem)
        docs = retriever.invoke(request.question)
        context = (
            "\n".join([doc.page_content for doc in docs]) if docs else "Общий контекст."
        )
        final_prompt = _combine_direction_and_problem_prompts(
            direction_prompt, problem_prompt, context, request.question
        )
        memory.chat_memory.add_user_message(final_prompt)
        result = agent_executor.invoke({"input": final_prompt})
        answer = result["output"]
        memory.chat_memory.add_ai_message(answer)
        store_dialog_message(request.question, answer)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def _create_prompt_with_context(system_message: str, context: str, user_query: str):
    return f"{system_message}\n\nКонтекст:\n{context}\n\nВопрос:\n{user_query}"


def _combine_direction_and_problem_prompts(
    dir_prompt, prob_prompt, context, user_query
):
    dir_text = dir_prompt.template if dir_prompt else ""
    prob_text = prob_prompt.template if prob_prompt else ""
    combined_prompt = (
        f"{dir_text.strip()}\n\n{prob_text.strip()}" if prob_prompt else dir_text
    )
    return combined_prompt.replace("{context}", context).replace(
        "{question}", user_query
    )
