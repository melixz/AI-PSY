from langchain.prompts import PromptTemplate

chat_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
    Используйте следующий контекст для ответа на вопрос.

    Контекст:
    {context}

    Вопрос:
    {question}

    Ответ:
    """,
)
