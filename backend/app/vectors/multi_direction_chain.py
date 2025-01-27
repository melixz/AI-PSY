from app.core.config import settings
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnableLambda, RunnableParallel
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model_name="gpt-4o-mini", openai_api_key=settings.OPENAI_API_KEY)

cbt_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Ты — психолог (КПТ)."),
        ("human", "Вопрос: {user_query}. Ответ с принципами КПТ."),
    ]
)

gestalt_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Ты — психолог (гештальт)."),
        ("human", "Вопрос: {user_query}. Ответ с гештальт-подходом."),
    ]
)

psycho_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Ты — психолог (психоанализ)."),
        ("human", "Вопрос: {user_query}. Ответ с психоаналитическим фокусом."),
    ]
)

cbt_chain = cbt_prompt | model | StrOutputParser()
gestalt_chain = gestalt_prompt | model | StrOutputParser()
psycho_chain = psycho_prompt | model | StrOutputParser()

parallel_chain = RunnableParallel(
    branches={
        "cbt": cbt_chain,
        "gestalt": gestalt_chain,
        "psychoanalysis": psycho_chain,
    }
)

def format_multi_answer(branches_dict):
    c = branches_dict["cbt"]
    g = branches_dict["gestalt"]
    p = branches_dict["psychoanalysis"]
    return f"CBT:\n{c}\n\nГештальт:\n{g}\n\nПсихоанализ:\n{p}\n"

multi_direction_chain = parallel_chain | RunnableLambda(
    lambda x: format_multi_answer(x["branches"])
)
