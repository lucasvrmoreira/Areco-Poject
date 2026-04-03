from pydantic import BaseModel, Field

# Verifique se este nome está correto:
class QueryRequest(BaseModel):
    question: str = Field(..., min_length=5)

# E este também (que usamos no main.py):
class QueryResponse(BaseModel):
    sql_generated: str
    data: list
    human_response: str