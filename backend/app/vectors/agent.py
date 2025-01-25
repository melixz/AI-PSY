import datetime
from langchain.memory import ConversationSummaryMemory
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.messages import SystemMessage
from langchain.agents import AgentExecutor, create_structured_chat_agent
from langchain_core.tools import Tool
from langchain_openai import ChatOpenAI
from app.core.config import settings
from app.vectors.vector import vectorstore


def get_current_time(*args, **kwargs):
    now = datetime.datetime.now()
    return now.strftime("%I:%M %p")


tools = [
    Tool(name="Time", func=get_current_time, description="Узнать текущее время"),
]

llm = ChatOpenAI(model_name="o1-mini", openai_api_key=settings.OPENAI_API_KEY)

base_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessagePromptTemplate.from_template(
            "Ты — виртуальный ассистент. У тебя есть следующие инструменты: {tool_names}. "
            "Вот описание доступных инструментов: {tools}. "
            "Если пользователь задаёт вопрос, используй подходящий инструмент. Если инструмент не нужен, дай ответ сам."
        ),
        HumanMessagePromptTemplate.from_template("{agent_scratchpad}"),
    ]
)

# Используем ConversationSummaryMemory для управления памятью
memory = ConversationSummaryMemory(
    llm=llm,
    summary_prompt=ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(
                "Сводка беседы:\n{summary}\n\nНовое сообщение:\n{new_message}\n\n"
                "Обнови сводку, чтобы включить ключевые моменты нового сообщения."
            )
        ]
    ),
)

system_msg = "Ты умный помощник, можешь пользоваться инструментами Time."
memory.chat_memory.add_message(SystemMessage(content=system_msg))

agent = create_structured_chat_agent(llm=llm, tools=tools, prompt=base_prompt)

agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent, tools=tools, verbose=True, memory=memory, handle_parsing_errors=True
)


def store_dialog_message(user_input: str, bot_answer: str):
    docs = [
        {"page_content": user_input, "metadata": {"role": "user"}},
        {"page_content": bot_answer, "metadata": {"role": "assistant"}},
    ]
    vectorstore.add_texts(
        [d["page_content"] for d in docs], metadatas=[d["metadata"] for d in docs]
    )
