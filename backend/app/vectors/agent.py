import datetime
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_core.messages import SystemMessage
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_openai import ChatOpenAI
from langchain.tools import Tool
from app.core.config import settings
from app.vectors.vector import vectorstore


def get_current_time(*args, **kwargs):
    now = datetime.datetime.now()
    return now.strftime("%I:%M %p")


def search_documents(query: str) -> str:
    results = vectorstore.similarity_search(query)
    return "\n".join([doc.page_content for doc in results])


tools = [
    Tool(name="Time", func=get_current_time, description="Узнать текущее время"),
    Tool(
        name="DocumentSearch",
        func=search_documents,
        description="Ищет документы, связанные с запросом пользователя.",
    ),
]

llm = ChatOpenAI(
    model_name="gpt-4", temperature=0, openai_api_key=settings.OPENAI_API_KEY
)

memory = ConversationBufferMemory(
    memory_key="context",
    return_messages=True,
)

system_msg = (
    "Ты умный помощник, можешь пользоваться инструментами Time и DocumentSearch."
)
memory.chat_memory.add_message(SystemMessage(content=system_msg))

agent_prompt = PromptTemplate(
    input_variables=["context", "question", "agent_scratchpad"],
    template="""
    Ты — сострадательный и клиентоориентированный психотерапевт.
    Твоя цель — поддерживать пользователя, адаптировать ответы к его запросу, учитывать стиль его речи и предлагать разнообразные, но последовательные и уместные рекомендации.

    Контекст (из базы знаний):
    {context}

    У тебя есть следующие инструменты:
    Time, DocumentSearch

    Инструкции:
    1. Оцени сложность вопроса:
    - Если вопрос связан с повседневными неудобствами или простыми проблемами, используй краткие, практичные и конструктивные рекомендации.
    - Если вопрос связан с сильными эмоциями или сложными ситуациями, прояви эмпатию, предложи развернутую поддержку и соответствующие действия.
    2. Учитывай стиль речи пользователя:
    - Если стиль формальный, используй структурированный и уважительный тон (например, "Спасибо, что поделились своим вопросом.").
    - Если стиль неформальный, используй дружелюбный и непринуждённый тон (например, "Понял вас, давайте разберёмся!").
    - Если пользователь использует эмодзи, можешь добавить соответствующие эмодзи в ответ, чтобы установить более эмоциональный контакт.
    3. Для разнообразия ответов:
    - Используй разные подходы к формулировке рекомендаций, сохраняя их суть.
    - Структурируй ответы по-разному: начиная с эмпатии, техники заземления или сразу с практической рекомендации.
    - Применяй вариативность в заключительных фразах: "Вы уже сделали шаг к решению", "Ваши усилия важны", "Это требует времени, но вы справитесь".
    4. Поддерживай баланс между краткостью и полнотой:
    - Для простых вопросов давай одно-два действия.
    - Для сложных вопросов предложи 2–3 шага и завершай поддерживающей фразой.

    Ограничения:
    - Не спрашивай о подробностях травмирующих событий.
    - Избегай триггерных формулировок или перегруженности пользователя большим количеством шагов одновременно.
    - Не усиливай чувство вины или беспомощности — акцентируй внимание на росте и возможностях.

    Формат ответа:
    1. Приветствие, учитывающее стиль речи пользователя.
    2. Рекомендация или техника самопомощи:
    - Для простых вопросов: одна рекомендация или шаг.
    - Для сложных вопросов: развернутая поддержка и несколько шагов.
    3. Заключительная поддержка, подчеркивающая рост и возможности.

    Пример:
    - Повседневный вопрос: "Я злюсь, потому что мне наступили на ногу."
    Ответ: "Понял вас, давайте разберёмся! Злость — это нормальная реакция. Попробуйте сделать глубокий вдох и отпустить ситуацию. ✨ Всё будет хорошо!"
    - Эмоционально сложный вопрос: "Меня разочаровали на работе, и я чувствую себя ненужным."
    Ответ: "Спасибо, что поделились своим вопросом. Я понимаю, как это тяжело. Сделайте несколько глубоких вдохов, чтобы обрести спокойствие, и подумайте, что вас особенно огорчило. Вы уже сделали шаг к улучшению, обратившись за поддержкой."

    Ввод пользователя:
    "{question}"

    Если ты не знаешь ответа или тебе нужно больше информации, используй соответствующий инструмент. Инструменты можно использовать для поиска данных или предоставления полезных советов. Если инструмент не требуется, дай ответ самостоятельно.

    {agent_scratchpad}

    Ответь, адаптируя тональность, длину и стиль ответа к ситуации, используя разнообразие формулировок.
    """,
)

agent = create_tool_calling_agent(llm=llm, tools=tools, prompt=agent_prompt)

agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent, tools=tools, memory=memory, verbose=True
)


def process_user_input(user_input: str) -> str:
    inputs = {
        "question": user_input,
    }

    try:
        response = agent_executor.invoke(inputs)  # Запуск агента
        if isinstance(response, dict):
            if "return_values" in response and "output" in response["return_values"]:
                return response["return_values"]["output"]
            elif "output" in response:
                return response["output"]
            else:
                return f"Unexpected response structure: {response}"
        else:
            return str(response)
    except Exception as e:
        print(f"Error during processing user input: {e}")
        return f"Произошла ошибка при обработке: {str(e)}"


def store_dialog_message(user_input: str, bot_answer: str):
    docs = [
        {"page_content": user_input, "metadata": {"role": "user"}},
        {"page_content": bot_answer, "metadata": {"role": "assistant"}},
    ]
    vectorstore.add_texts(
        [d["page_content"] for d in docs], metadatas=[d["metadata"] for d in docs]
    )
