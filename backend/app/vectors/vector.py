import os
from pathlib import Path
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings
from app.prompts.prompt import base_prompt

embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)

if not os.path.exists(settings.CHROMA_PERSIST_DIR):
    os.makedirs(settings.CHROMA_PERSIST_DIR)

vectorstore = Chroma(
    collection_name="psychology_base",
    embedding_function=embeddings,
    persist_directory=settings.CHROMA_PERSIST_DIR,
)


def load_docs_with_meta(base_path: str, category: str):
    docs = []
    base_dir = Path(base_path)
    for subdir in base_dir.iterdir():
        if subdir.is_dir():
            val = subdir.name
            loader = DirectoryLoader(str(subdir))
            raw_docs = loader.load()
            if not raw_docs:
                continue
            splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
            split_docs = splitter.split_documents(raw_docs)
            for doc in split_docs:
                doc.metadata[category] = val
                doc.metadata["source"] = str(doc.metadata.get("source", subdir))
                doc.metadata["file_name"] = Path(doc.metadata.get("source", "")).name
                doc.metadata["file_path"] = str(subdir)
                doc.metadata["file_size"] = (
                    os.path.getsize(doc.metadata["source"])
                    if "source" in doc.metadata
                    else None
                )
            docs.extend(split_docs)
    return docs


try:
    directions_path = "app/documents/psychology/psy_directions"
    direction_docs = load_docs_with_meta(directions_path, "direction")

    problems_path = "app/documents/psychology/psy_problems"
    problem_docs = load_docs_with_meta(problems_path, "problem")

    all_docs = direction_docs + problem_docs

    if all_docs:
        vectorstore.add_documents(all_docs)
        print(f"✅ Успешно загружено {len(all_docs)} документов в векторное хранилище.")
    else:
        print("⚠️ Нет документов для загрузки.")
except Exception as e:
    print("❌ Ошибка загрузки документов:", e)

llm = ChatOpenAI(model_name="o1-mini", openai_api_key=settings.OPENAI_API_KEY)


def get_filtered_retriever(direction=None, problem=None):
    flt = {}
    if direction:
        flt["direction"] = direction
    if problem:
        flt["problem"] = problem
    if not flt:
        return vectorstore.as_retriever(search_kwargs={"k": settings.retriever_k})
    return vectorstore.as_retriever(
        search_kwargs={"k": settings.retriever_k, "filter": flt}
    )


def get_qa_chain_for_prompt(prompt_template, direction=None, problem=None):
    retriever = get_filtered_retriever(direction, problem)
    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt_template, "verbose": False},
    )


qa_chain_base = get_qa_chain_for_prompt(base_prompt)
