import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI_PSY"
    retriever_k: int = 1
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

    class Config:
        env_file = ".env"


settings = Settings()
