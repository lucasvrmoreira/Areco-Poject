from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import declarative_base

# A Base é a "mãe" de todos os nossos modelos
Base = declarative_base()

class Sale(Base):
    __tablename__ = "vendas" # Nome EXATO que está no script que você rodou

    id = Column(Integer, primary_key=True, index=True)
    data = Column(String) # O script salvou como TEXT (YYYY-MM-DD)
    produto = Column(String)
    valor_unidade = Column(Float)
    quantidade = Column(Integer)
    total = Column(Float)
    forma_pagamento = Column(String)
    parcelado = Column(String) # "Sim" ou "Não" no script original