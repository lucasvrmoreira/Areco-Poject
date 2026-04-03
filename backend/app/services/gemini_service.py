import os
from google import genai
from fastapi import HTTPException
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("ArecoChallenge")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# PROMPT DE SISTEMA PARA O GEMINI, COM REGRAS DE LÓGICA AVANÇADA E GRÁFICOS, ALÉM DE INSTRUÇÕES CLARAS PARA EVITAR ERROS COMUNS DE SQL. ESTE PROMPT É A CHAVE PARA GERAR CONSULTAS SQL CORRETAS E ÚTEIS, MESMO PARA PERGUNTAS COMPLEXAS DOS USUÁRIOS.
SYSTEM_PROMPT = """
Tabela 'vendas': id, data (YYYY-MM-DD), produto, valor_unidade, quantidade, total, forma_pagamento, parcelado.

DADOS EXATOS DO BANCO:
- Formas de pagamento: 'Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Pix'.
- Valores da coluna parcelado: 'Sim', 'Não'.

REGRAS DE LÓGICA AVANÇADA E GRÁFICOS:
1. LÓGICA DE EXCLUSÃO SIMPLES: Se o usuário pedir para excluir algo (ex: "NÃO foram vendidos no Pix"), filtre apenas as transações. Use um WHERE simples com NOT LIKE. Ex: LOWER(forma_pagamento) NOT LIKE '%pix%'.
2. BUSCA FLEXÍVEL: Use LOWER(coluna) LIKE LOWER('%termo%') para evitar erros de case e acentuação nos filtros.
3. GRÁFICOS (OBRIGATÓRIO): Sempre retorne uma coluna de texto (categoria/Eixo X) e uma métrica numérica (SUM, AVG, COUNT / Eixo Y).
4. PROIBIDO USAR 'ID': NUNCA use a coluna 'id' no SELECT ou GROUP BY. Agrupe sempre por dimensões de negócio (produto, forma_pagamento, parcelado, data).
5. DATAS NO SQLITE: Se o usuário perguntar "por mês" ou "mensal", use STRFTIME('%Y-%m', data) para agrupar e exibir.
6. RANKINGS: Se o usuário pedir os "maiores", "melhores" ou um "Top X", sempre use ORDER BY [métrica] DESC e adicione o LIMIT correspondente.
7. APENAS SQL: Retorne apenas o código SELECT, sem explicações e sem blocos de código markdown.
8. APELIDOS DE COLUNA (AS): Sempre que usar funções como STRFTIME, SUM, AVG ou COUNT, você DEVE atribuir um nome amigável usando 'AS'.
   Exemplo: STRFTIME('%Y-%m', data) AS Mes, SUM(total) AS Faturamento
"""

async def translate_to_sql(user_question: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{SYSTEM_PROMPT}\nPergunta: {user_question}"
        )
        
        sql_query = response.text.strip()

        if "SELECT" in sql_query.upper():
            start_index = sql_query.upper().find("SELECT")
            sql_query = sql_query[start_index:].split(';')[0] + ';'
        
        logger.info(f"SQL Gerado com Sucesso: {sql_query}")
        return sql_query

    except Exception as e:
        logger.error(f"Erro na integração: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro na inteligência de dados.")

# 2. ATUALIZAMOS A FUNÇÃO PARA ELA RESUMIR LISTAS LONGAS
async def generate_human_response(user_question: str, data_results: list) -> str:
    try:
        prompt = f"""
        Você é o assistente de dados Areco IA.
        O usuário perguntou: "{user_question}"
        O banco de dados retornou o seguinte resultado JSON: {data_results}
        
        Escreva uma resposta amigável e executiva respondendo à pergunta usando esses dados.
        REGRA DE OURO: Se o JSON tiver muitos itens (mais de 3), NUNCA liste todos eles no texto. Cite apenas os 2 ou 3 principais/maiores destaques e diga para o usuário conferir a tabela e o gráfico ao lado para ver os detalhes completos.
        Máximo de 2 parágrafos curtos.
        """
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Erro ao gerar resposta humana: {str(e)}")
        return f"Encontrei {len(data_results)} registros no banco de dados."