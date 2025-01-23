from fastapi import APIRouter, HTTPException


from langchain_core.prompts import PromptTemplate

from app.models import ChatRequest, ChatResponse
from app.vectors.vector import get_qa_chain_for_prompt, qa_chain_base, get_filtered_retriever
from app.vectors.prompt import base_prompt
from app.vectors.psy_directions.direction_prompts import get_direction_prompt
from app.vectors.psy_problems.problem_prompts import get_problem_prompt


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask", response_model=ChatResponse)
async def ask_chat(request: ChatRequest):
    """
    Эндпоинт для базового промта (без направления или проблемы).
    """
    try:
        retriever = qa_chain_base.retriever
        docs = retriever.invoke(request.question)
        fallback_context = "Общий контекст о психологии и методах самопомощи."
        context = "\n".join([doc.page_content for doc in docs]) if docs else fallback_context
        
        response = await qa_chain_base.ainvoke({"query": request.question, "context": context})
        answer = response.get("result", "Ответ не найден")
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")


@router.post("/ask_specialized", response_model=ChatResponse)
async def ask_chat_specialized(
        request: ChatRequest,
        direction: str = None,
        problem: str = None,
):
    print(f"Received question: {request.question}, direction: {direction}, problem: {problem}")
    """
    Эндпоинт для работы с промтами направления и/или проблемы.
    direction = 'cbt', 'gestalt' и т.д.
    problem = 'panic', 'anxiety' и т.д.
    """
    try:
        # Получаем подходящий промт
        prob_prompt = get_problem_prompt(problem) if problem else None
        dir_prompt = get_direction_prompt(direction) if direction else None
        
        # Логика выбора промта:
        if prob_prompt and dir_prompt:
            combined_template = f"{dir_prompt.template.strip()}\n\n{prob_prompt.template.strip()}"
            final_prompt = PromptTemplate(input_variables=["context", "query"], template=combined_template)
        elif prob_prompt:
            final_prompt = prob_prompt
        elif dir_prompt:
            final_prompt = dir_prompt
        else:
            final_prompt = base_prompt
        
        print(f"Using prompt: {final_prompt.template}")  # Логируем выбранный промт
        
        retriever = get_filtered_retriever(direction=direction, problem=problem)
        docs = retriever.invoke(request.question)
        fallback_context = "Общий контекст о психологии и методах самопомощи."
        context = "\n".join([doc.page_content for doc in docs]) if docs else fallback_context
        
        # Создаём цепочку с выбранным промтом
        chain = get_qa_chain_for_prompt(final_prompt, direction=direction, problem=problem)
        response = await chain.ainvoke({"query": request.question, "context": context})
        answer = response.get("result", "Ответ не найден")
        return ChatResponse(answer=answer)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка: {str(e)}")
