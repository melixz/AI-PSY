from fastapi import FastAPI
from app.core.middlewares import setup_cors
from app.api.routes import chat

app = FastAPI(
    title="AI_PSY LangChain API",
    version="0.1.0",
    description="Психологический AI-ассистент, основанный на LangChain",
)

setup_cors(app)

app.include_router(chat.router)
