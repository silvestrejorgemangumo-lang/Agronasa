# Arquitectura

`Navegador (HTML/CSS/JS + Leaflet)` → `Flask REST API` → `Serviço NASA POWER` e `Motor de regras` → `PostgreSQL (catálogo de culturas)`.

O navegador envia coordenadas seleccionadas manualmente, tipo de solo, culturas anteriores e prioridade. O backend valida a entrada, consulta a NASA POWER e calcula estratégias. Se a NASA estiver indisponível, o backend comunica o aviso e mantém a geração de estratégias com as regras agronómicas locais. Nesta versão, a base de dados guarda apenas o catálogo de culturas; não guarda coordenadas nem análises individuais.

## Módulos do backend
- `routes/`: endpoints HTTP.
- `services/nasa_power.py`: integração externa e normalização dos indicadores.
- `services/rotation_engine.py`: regras e pontuação transparente.
- `models/`: modelo SQLAlchemy.
- `utils/validators.py`: validação dos dados de entrada.
- `tests/`: testes automatizados.
