
📊 Areco IA — Business Intelligence

O Areco IA é uma plataforma de Business Intelligence capaz de traduzir perguntas em linguagem natural para consultas SQL estruturadas, executá-las em um banco de dados relacional e apresentar os resultados de forma analítica e visual.

🛠️ Stack Tecnológica

O projeto foi construído utilizando as tecnologias exigidas e bibliotecas de alta performance para visualização:


1. Backend: Python com o framework FastAPI.


2. Frontend: React utilizando o framework Next.js.


3. Banco de Dados: SQLite (banco de dados relacional baseado em arquivo).


4. IA Generativa: SDK do Google Gemini model="gemini-2.5-flash", para orquestração de linguagem natural.


5. Visualização: Recharts para renderização automática de gráficos.


6. Interface: Lucide React (ícones) e Tailwind CSS (estilização).


🏗️ Arquitetura da Solução

O sistema segue uma separação clara de responsabilidades para garantir escalabilidade e clareza de código:

1. Camada de Inteligência: Implementação de um endpoint que recebe perguntas de negócio e utiliza um Prompt de Sistema especializado contendo o esquema (DDL) do banco de dados.
2. Processamento SQL: A aplicação extrai apenas o código SQL da resposta da IA, executa-o de forma segura e retorna os dados brutos e uma síntese textual.
3. Interface de Chat: Campo de entrada estilo chat com histórico de interação.
4. Dashboard Dinâmico: Renderização automática de tabelas e gráficos para séries temporais, comparações de categorias ou volumes financeiros


⚙️ Configuração e Instalação

 Backend (Python)
 
1. Navegue até a pasta: cd backend

2. Crie um ambiente virtual: python -m venv venv

3. Ative o ambiente: source venv/bin/activate (ou venv\Scripts\activate no Windows)

4. Instale as dependências: pip install -r requirements.txt

5. Configure o arquivo .env com sua chave: GEMINI_API_KEY=SUA_CHAVE_AQUI 

6. Inicie o servidor: uvicorn app.main:app --reload


Frontend (Next.js)

1. avegue até a pasta: cd frontend

2. Instale as dependências: npm install

3. Inicie a aplicação: npm run dev


🛡️ Segurança e Engenharia de Prompt

1. Estratégia de Prompt: O prompt foi estruturado com regras negativas para evitar alucinações e garantir que a IA gere apenas SQL válido para SQLite.
2. Mitigação de Riscos: Implementação de tratamento de erros no backend para lidar com consultas inválidas e evitar a execução de comandos indevidos no banco

🛡️ Validação de Dados com Pydantic

1. Validação de Entrada: O sistema garante que a pergunta do usuário tenha o formato e tamanho mínimo necessários antes de processar a IA.
2. Contratos de Resposta: Define exatamente quais campos o Frontend receberá (SQL, Dados, Resposta Humana), evitando erros de integração
3. Tratamento de Erros: Caso o banco de dados falhe, o Pydantic ajuda a estruturar a mensagem de erro amigável que será exibida no chat.

🛡️ Segurança e Comunicação (CORS)

1. Controle de Acesso: Define quais origens (domínios) podem realizar requisições ao servidor de dados.
2. Segurança de Navegação: Protege contra ataques de Cross-Site Request Forgery (CSRF), garantindo que apenas a interface autorizada interaja com o banco de dados SQLite.
3. Flexibilidade de Desenvolvimento: Configurado para permitir métodos (GET, POST) e cabeçalhos específicos, seguindo as melhores práticas de APIs modernas.
