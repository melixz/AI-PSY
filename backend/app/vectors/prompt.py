from langchain.prompts import ChatPromptTemplate

system_message = """
Ты — психологический AI-ассистент. Отвечай дружелюбно и поддерживающе, 
используй базовые понятия психологии. Если не знаешь ответа, скажи об этом прямо.
"""

user_message = """
Вопрос пользователя: {question}
"""

chat_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_message),

    ]
)
