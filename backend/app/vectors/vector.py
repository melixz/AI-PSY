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

# Проверяем, существует ли база данных
if not os.path.exists(settings.CHROMA_PERSIST_DIR):
    os.makedirs(settings.CHROMA_PERSIST_DIR)

# Инициализируем векторное хранилище
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
    if documents:
        vectorstore.add_documents(documents)  # Добавляем документы в хранилище
        # Пересоздаём объект Chroma для работы с обновлённой базой
        vectorstore = Chroma(
            collection_name="psychology_base",
            embedding_function=embeddings,
            persist_directory=settings.CHROMA_PERSIST_DIR,
        )
    else:
        print("No documents found to add to the vectorstore.")
except FileNotFoundError as fnf_error:
    print(f"Ошибка: {fnf_error}")
except Exception as e:
    print(f"Ошибка при загрузке документов: {e}")

# Создаём LLM
llm = ChatOpenAI(
    model_name="o1-mini",
    openai_api_key=settings.OPENAI_API_KEY,
)

# Создаём ретривер
retriever = vectorstore.as_retriever(search_kwargs={"k": settings.retriever_k})

# Создаём RetrievalQA цепочку (chain_type="stuff")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": chat_prompt, "verbose": True},
)
