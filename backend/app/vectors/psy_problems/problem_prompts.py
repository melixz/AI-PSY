from langchain.prompts import PromptTemplate

panic_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
У пользователя панические атаки.

Контекст:
{context}

Вопрос:
{question}

Ответь с учётом паники и предложи мягкие техники самопомощи.
""",
)

anxiety_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
У пользователя тревожность.

Контекст:
{context}

Вопрос:
{question}

Ответь, учитывая тревожность, и предложи упражнения для снижения тревоги.
""",
)

depression_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
У пользователя депрессия.

Контекст:
{context}

Вопрос:
{question}

Ответь с акцентом на поддержку при депрессии.
""",
)

burnout_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
У пользователя эмоциональное выгорание.

Контекст:
{context}

Вопрос:
{question}

Ответь, делая упор на отдых и баланс.
""",
)

relationship_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
У пользователя сложности в отношениях.

Контекст:
{context}

Вопрос:
{question}

Ответь с учётом возможных конфликтов или проблем в коммуникации.
""",
)

PROBLEM_PROMPTS = {
    "panic": panic_prompt,
    "anxiety": anxiety_prompt,
    "depression": depression_prompt,
    "burnout": burnout_prompt,
    "relationship": relationship_prompt,
}


def get_problem_prompt(problem_name: str):
    return PROBLEM_PROMPTS.get(problem_name.lower())
