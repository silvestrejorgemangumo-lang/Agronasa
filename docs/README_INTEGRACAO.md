# AgroNASA — integração frontend + backend

## O que foi ligado
- Clique no mapa Leaflet: obtém latitude/longitude e chama `GET /api/location-data`.
- NASA POWER: apresenta médias climáticas dos últimos 30 dias completos.
- Meteomatics: apresenta os valores mais recentes da previsão horária de 24 horas.
- SoilGrids: apresenta propriedades estimadas do solo (camada 0–5 cm).
- Cada API tem estado independente; uma falha não bloqueia as outras.
- O formulário de rotação continua a usar `POST /api/analyze` e NASA POWER.

## Instalação
1. Extraia o ZIP.
2. Entre na pasta `backend`.
3. Crie e active um ambiente virtual Python.
4. Instale dependências: `pip install -r requirements.txt`.
5. Copie `.env.example` para `.env` e configure `DATABASE_URL`.
6. Preencha `METEOMATICS_USERNAME` e `METEOMATICS_PASSWORD` com credenciais válidas.
7. Execute `python run.py`.
8. Abra `http://127.0.0.1:5000`.

A estrutura `frontend/` deve permanecer ao lado da pasta `backend/`, pois o Flask
serve o HTML e os assets a partir dessa localização.

## Endpoints
- `GET /api/health`
- `GET /api/climate?latitude=...&longitude=...`
- `GET /api/location-data?latitude=...&longitude=...`
- `POST /api/analyze`

## Limitações
- Meteomatics requer credenciais válidas.
- SoilGrids depende da disponibilidade do serviço ISRIC.
- As fontes têm resoluções espaciais e temporais diferentes; coordenadas iguais
  não significam medições da mesma resolução ou da parcela exata.
- A integração foi validada quanto à sintaxe JavaScript e Python. Testes com
  serviços externos exigem rede e credenciais reais.
