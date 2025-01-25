import datetime
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import SystemMessage
from langchain.agents import AgentExecutor, create_structured_chat_agent
from langchain_core.tools import Tool
from langchain_openai import ChatOpenAI
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from app.core.config import settings
from app.vectors.vector import vectorstore


def get_current_time(*args, **kwargs):
    now = datetime.datetime.now()
    return now.strftime("%I:%M %p")


wiki_api_wrapper = WikipediaAPIWrapper()
wikipedia_tool = WikipediaQueryRun(api_wrapper=wiki_api_wrapper)


tools = [
    Tool(name="Time", func=get_current_time, description="Узнать текущее время"),
    Tool(
        name="Wikipedia",
        func=wikipedia_tool.run,
        description="Поиск информации в Википедии. Запросите краткое описание термина или темы.",
    ),
]

llm = ChatOpenAI(model_name="o1-mini", openai_api_key=settings.OPENAI_API_KEY)

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
system_msg = "Ты умный помощник, можешь пользоваться инструментами Time и Wikipedia."
memory.chat_memory.add_message(SystemMessage(content=system_msg))

agent = create_structured_chat_agent(llm=llm, tools=tools)
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
    vectorstore.persist()
