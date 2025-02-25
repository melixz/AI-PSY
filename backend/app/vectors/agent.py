from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_core.messages import SystemMessage, AIMessage
from langchain_openai import ChatOpenAI
from app.core.config import settings
from app.vectors.vector import vectorstore
from app.utils.token_counter import count_tokens

llm = ChatOpenAI(
    model_name="gpt-4o-mini", temperature=1, openai_api_key=settings.OPENAI_API_KEY
)

memory = ConversationBufferMemory(memory_key="context", return_messages=True)
memory.chat_memory.add_message(SystemMessage(content="Ты умный помощник."))

agent_prompt = PromptTemplate(
    input_variables=["question", "agent_scratchpad"],
    template="""
Ты — сострадательный психотерапевт.
Вопрос пользователя: {question}
{agent_scratchpad}
""",
)


def process_user_input(user_input: str) -> str:
    if not isinstance(user_input, str):
        return "Error: Input must be a string."

    before_tokens = count_tokens(user_input, model_name="o1-mini")
    try:
        response = llm.invoke(user_input)

        if isinstance(response, AIMessage):
            result = response.content
        elif isinstance(response, str):
            result = response
        else:
            raise ValueError(f"Unexpected response type: {type(response)}")

        after_tokens = count_tokens(result, model_name="o1-mini")
        print(f"[DEBUG] Tokens used: user={before_tokens}, answer={after_tokens}")
        print(f"[DEBUG] Model response: {result}")
        return result
    except Exception as e:
        return f"Error: {str(e)}"


def store_dialog_message(user_input: str, bot_answer: str):
    docs = [
        {"page_content": user_input, "metadata": {"role": "user"}},
        {"page_content": bot_answer, "metadata": {"role": "assistant"}},
    ]
    vectorstore.add_texts(
        [d["page_content"] for d in docs], metadatas=[d["metadata"] for d in docs]
    )
