# AgroSmart NASA — versão funcional inicial

Aplicação web para explorar estratégias de rotação de culturas com base em dados climáticos da NASA POWER, tipo de solo indicado pelo agricultor, culturas anteriores e prioridade seleccionada.

## Tecnologias
- Frontend: HTML5, CSS3 e JavaScript
- Mapa: Leaflet + OpenStreetMap
- Backend: Python 3.10+ e Flask
- Base de dados: PostgreSQL (SQLite é usado automaticamente apenas para desenvolvimento/testes se `DATABASE_URL` não for definido)
- Testes: pytest
- Dados: NASA POWER API. Earthdata/SMAP, MODIS/VIIRS e Sentinel-2 ficam preparados como integrações futuras; não são simulados como se já estivessem ligados.

## Executar localmente
1. Instale Python 3.10 ou superior e PostgreSQL.
2. Crie uma base de dados e utilizador PostgreSQL, por exemplo `createdb agrosmart`.
3. Entre em `backend/` e crie ambiente: `python -m venv .venv`.
4. Active-o: Linux/macOS `source .venv/bin/activate`; Windows `.venv\Scripts\activate`.
5. Instale: `pip install -r requirements.txt`.
6. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` para `postgresql+psycopg://utilizador:senha@localhost:5432/agrosmart`.
7. Inicie: `python run.py`.
8. Abra `http://127.0.0.1:5000`.

A tabela de culturas é criada e preenchida na primeira chamada a `/api/crops` ou `/api/analyze`. Para ambiente real, use migrações (Alembic/Flask-Migrate) e não `db.create_all()` improvisado.

## Testes
Na pasta `backend/`: `pytest -q`. Os testes usam SQLite temporário e simulam a resposta NASA; não fazem chamadas externas.

## API
- `GET /api/health` — estado do serviço
- `GET /api/crops` — catálogo de culturas
- `GET /api/climate?latitude=-25.97&longitude=32.58` — consulta NASA POWER
- `POST /api/analyze` — valida entradas, tenta obter clima e gera até três estratégias

Exemplo de JSON para `/api/analyze`:
```json
{"latitude":-25.97,"longitude":32.58,"soil_type":"franco","priority":"poupar_agua","previous_crops":["Milho"]}
```

## Correcções e limites importantes do backend
- Separação por rotas, serviços, modelos e validadores.
- Validação de latitude/longitude, solo, prioridade e culturas anteriores.
- Tratamento de indisponibilidade da NASA: a análise continua com regras locais e devolve aviso.
- A aplicação não grava coordenadas nem histórico de localização na base de dados. As coordenadas são usadas apenas para consultar a API externa e não são devolvidas na resposta.
- Não há cache persistente de coordenadas. A cache ainda não foi activada nesta versão para evitar armazenar localização exacta inadvertidamente.
- O score é um ranking heurístico explicável, não é previsão de rendimento nem recomendação agronómica certificada. Deve ser validado por especialistas e dados locais.
- A análise climática da NASA POWER é de escala regional; não representa medições exactas de uma parcela.

## Próximas integrações
1. Earthdata: SMAP para humidade do solo e MODIS/VIIRS ou Landsat/Sentinel-2 para NDVI.
2. Dados de solo locais ou SoilGrids, com indicação de resolução/incerteza.
3. Cache de dados ambientais sem guardar coordenadas exactas (por células espaciais agregadas e política de retenção documentada).
4. Migrações, autenticação, limites de requisição, logs e implantação HTTPS.

## Privacidade
Não introduza dados pessoais. A aplicação não persiste as coordenadas recebidas, mas a consulta é enviada à NASA POWER. O fornecedor de mapas (OpenStreetMap) recebe pedidos de mosaicos do navegador.
