from fastapi import FastAPI
from app.api.routes import chat

app = FastAPI(
    title="AI_PSY LangChain API",
    version="0.1.0",
    description="Психологический AI-ассистент, основанный на LangChain",
)

app.include_router(chat.router)
