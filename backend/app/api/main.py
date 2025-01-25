from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import chat

app = FastAPI(
    title="AI_PSY LangChain API",
    version="0.1.0",
    description="Психологический AI-ассистент, основанный на LangChain",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #TODO ИЗМЕНИТЬ НА РЕАЛЬНЫЙ ДОМЕН!!!
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
