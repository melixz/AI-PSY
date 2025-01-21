FROM python:3.12-slim

WORKDIR /backend

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY . /backend/

RUN uv sync --frozen

CMD [ "uv", "run", "uvicorn", "app.api.main:app", "--host", "0.0.0.0"]