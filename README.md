# 🌱 AgroSmart NASA — Versão Funcional Inicial

Aplicação web para explorar estratégias de rotação de culturas com base em dados climáticos da **NASA POWER**, tipo de solo indicado pelo agricultor, culturas anteriores e prioridade selecionada.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 e JavaScript (Vanilla)
* **Mapas:** Leaflet + OpenStreetMap
* **Backend:** Python 3.10+ e Flask
* **Base de Dados:** PostgreSQL *(utiliza SQLite automaticamente apenas para desenvolvimento/testes caso `DATABASE_URL` não esteja definido)*
* **Testes:** `pytest`
* **Dados Ambientais:** NASA POWER API *(Earthdata/SMAP, MODIS/VIIRS e Sentinel-2 estão previstos para integrações futuras e não são simulados nesta versão)*

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
* Python 3.10 ou superior
* PostgreSQL instalado e em execução

### 2. Configuração da Base de Dados
Crie a base de dados e o utilizador no PostgreSQL:
```bash
createdb agrosmart

```

### 3. Instalação e Ambiente Virtual

Acesse a pasta backend/, crie e ative o ambiente virtual e instale as dependências:
```
cd backend/
python -m venv .venv
```
Linux / macOS:
```
source .venv/bin/activate
```
Windows:
```
.venv\Scripts\activate
```
Instale os pacotes necessários:
```
pip install -r requirements.txt
```
### 4. Variáveis de Ambiente

Copie o ficheiro de exemplo e configure a ligação à base de dados:
```
cp .env.example .env
```
Edite o ficheiro .env e ajuste a variável DATABASE_URL:

```
DATABASE_URL=postgresql+psycopg://utilizador:senha@localhost:5432/agrosmart
```

### 5. Iniciar a Aplicação

Execute o servidor local:
```
python run.py
```
Aceda no navegador: http://127.0.0.1:5000

Nota sobre a base de dados: A tabela de culturas é criada e populada automaticamente na primeira chamada a /api/crops ou /api/analyze. Para ambientes de produção, utilize ferramentas de migração (como Alembic/Flask-Migrate) em vez de db.create_all().

🧪 Executar Testes

Na pasta backend/, execute a suíte de testes:
```
pytest -q
```
Os testes utilizam uma instância temporária de SQLite e simulam as respostas da NASA, não realizando chamadas externas.
