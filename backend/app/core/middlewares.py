from fastapi.middleware.cors import CORSMiddleware


def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # TODO: Изменить на реальные домены для продакшена
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
