# Plano de testes

| Caso | Resultado esperado |
|---|---|
| GET /api/health | HTTP 200 e status ok |
| GET /api/crops | Lista de culturas |
| POST /api/analyze com dados válidos | HTTP 200 e até 3 estratégias |
| Latitude fora do intervalo | HTTP 400 |
| Solo não reconhecido | HTTP 400 |
| Prioridade inválida | HTTP 400 |
| NASA POWER indisponível | Estratégias locais com aviso |
| Privacidade | Resposta não contém latitude/longitude; não existe modelo de localização |

Executar `pytest -q` na pasta `backend/`.
