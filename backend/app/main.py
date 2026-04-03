import logging 
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from app.schemas.query_schema import QueryRequest
from app.services.gemini_service import translate_to_sql, generate_human_response



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Habilita o CORS para Frontend Next.js conseguir conectar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rota principal para receber perguntas
@app.post("/ask")
async def ask_question(request: QueryRequest):
    try:
        # 1. Gera o SQL
        sql_query = await translate_to_sql(request.question)
        
        # 2. Tenta rodar no banco de dados
        try:
            conn = sqlite3.connect("vendas_ficticias.db")
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(sql_query)
            rows = cursor.fetchall()
            
            data_results = [dict(row) for row in rows]
            conn.close()
            
        except Exception as db_error:
            # SE O SQL FALHAR, CAI AQUI!
            logger.error(f"Erro ao executar SQL: {db_error}")
            return {
                "sql_generated": sql_query,
                "data": [],
                "human_response": "Desculpe, a forma como a pergunta foi feita gerou um cruzamento de dados que não consegui processar. Você poderia tentar reformular de forma mais simples?"
            }

        # 3. Se deu tudo certo, gera a resposta humana
        human_response = await generate_human_response(request.question, data_results)
        
        return {
            "sql_generated": sql_query,
            "data": data_results,
            "human_response": human_response 
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))