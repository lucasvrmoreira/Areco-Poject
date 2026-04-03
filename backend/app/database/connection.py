import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Pegamos a URL do banco de dados do arquivo .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Criando o motor de conexão assíncrona
# Usamos 'echo=True' apenas em desenvolvimento para ver o SQL no console
engine = create_async_engine(DATABASE_URL, echo=False)

# Criando a fábrica de sessões (onde as transações acontecem)
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Função para obter a conexão (Dependency Injection no FastAPI)
async def get_db():
    async with async_session() as session:
        yield session