import os
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from backend.app.core.config import settings
from .prompt import chat_prompt

# Инициализация эмбеддингов
embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)

# Проверяем, существует ли база
if not os.path.exists(settings.CHROMA_PERSIST_DIR):
    os.makedirs(settings.CHROMA_PERSIST_DIR)

vectorstore = Chroma(
    collection_name="psychology_base",
    embedding_function=embeddings,
    persist_directory=settings.CHROMA_PERSIST_DIR,
)


# Функция для загрузки документов
def load_documents(directory_path):
    if not os.path.exists(directory_path):
        raise FileNotFoundError(f"Directory not found: {directory_path}")
    loader = DirectoryLoader(directory_path)
    raw_documents = loader.load()

    # Разбиваем документы на чанки
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    documents = text_splitter.split_documents(raw_documents)
    return documents


# Загружаем документы (если нужно)
documents_path = "backend/app/documents/psychology"
try:
    documents = load_documents(documents_path)
    vectorstore.add_documents(documents)
    vectorstore.persist()
except Exception as e:
    print(f"Ошибка при загрузке документов: {e}")

# Создаём LLM
llm = ChatOpenAI(
    model_name="gpt-4", openai_api_key=settings.OPENAI_API_KEY, temperature=0.7
)

# Retrieval цепочка (QA)
retriever = vectorstore.as_retriever(search_kwargs={"k": settings.retriever_k})
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={
        "document_variable_name": "question",  # Указываем правильное имя переменной
        "prompt": chat_prompt,  # Используем существующий промпт
    },
)
