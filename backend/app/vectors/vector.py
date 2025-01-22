import os
from pathlib import Path
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from backend.app.core.config import settings
from backend.app.vectors.prompt import base_prompt

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


# Функция для загрузки документов с метаданными
def load_documents_with_metadata(base_path: str, category: str):
    """
    Загружает документы из указанной директории и добавляет метаданные.
    :param base_path: Базовый путь к документам.
    :param category: Тип метаданных ('direction' или 'problem').
    :return: Список документов с метаданными.
    """
    documents = []
    base_dir = Path(base_path)
    
    for subdir in base_dir.iterdir():
        if subdir.is_dir():
            metadata_value = subdir.name  # Имя папки используется как метаданные
            loader = DirectoryLoader(str(subdir))
            raw_docs = loader.load()

            if not raw_docs:
                print(f"No documents found in {subdir}.")
                continue

            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
            split_docs = text_splitter.split_documents(raw_docs)

            for doc in split_docs:
                doc.metadata[category] = metadata_value
            
            documents.extend(split_docs)
    
    return documents


try:
    # Загрузка документов по направлениям
    directions_path = "backend/app/documents/psychology/psy_directions"
    direction_docs = load_documents_with_metadata(directions_path, category="direction")
    
    # Загрузка документов по проблемам
    problems_path = "backend/app/documents/psychology/psy_problems"
    problem_docs = load_documents_with_metadata(problems_path, category="problem")
    
    # Объединяем все документы
    all_docs = direction_docs + problem_docs
    if all_docs:
        vectorstore.add_documents(all_docs)
        print(f"Загружено {len(all_docs)} документов в векторное хранилище.")
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


# Функция для получения ретривера с фильтрацией
def get_filtered_retriever(direction=None, problem=None):
    """
    Возвращает ретривер с фильтрацией по метаданным.
    :param direction: Направление психологии (например, 'cbt').
    :param problem: Проблема (например, 'panic').
    :return: Ретривер с учётом фильтров.
    """
    filters = {}
    if direction:
        filters["direction"] = direction
    if problem:
        filters["problem"] = problem
    
    if not filters:
        return vectorstore.as_retriever(search_kwargs={"k": settings.retriever_k})
    else:
        return vectorstore.as_retriever(search_kwargs={"k": settings.retriever_k, "filter": filters})


# Функция для создания цепочки с кастомным промтом
def get_qa_chain_for_prompt(prompt_template, direction=None, problem=None):
    """
    Создаёт RetrievalQA цепочку с заданным промтом и фильтром контекста.
    :param prompt_template: Шаблон промта.
    :param direction: Направление психологии (например, 'cbt').
    :param problem: Проблема (например, 'panic').
    :return: RetrievalQA цепочка.
    """
    retriever = get_filtered_retriever(direction=direction, problem=problem)
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={
            "prompt": prompt_template,
            "verbose": True,
        },
    )
    return chain


# Базовая цепочка для простого использования
qa_chain_base = get_qa_chain_for_prompt(base_prompt)
