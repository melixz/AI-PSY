from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


class ErrorResponse(BaseModel):
    detail: str


class SuccessResponse(BaseModel):
    detail: str
