FROM python:3.12-slim

WORKDIR /backend

RUN apt-get update && apt-get install -y \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY . /backend/

RUN uv sync

CMD ["uv", "run", "uvicorn", "app.api.main:app", "--host", "0.0.0.0"]
