# Integração das APIs com o mapa

## Endpoint unificado
O mapa deve enviar a latitude e longitude do ponto selecionado para:

`GET /api/location-data?latitude=-25.97&longitude=32.58`

A resposta agrega os resultados em `sources.nasa_power`, `sources.meteomatics` e
`sources.soilgrids`. Cada fonte tem `status: "ok"` ou `status: "unavailable"`.
Uma falha de um fornecedor não impede a consulta aos outros.

## Endpoints existentes
- `GET /api/climate?latitude=...&longitude=...`: NASA POWER.
- `POST /api/analyze`: análise de rotação agrícola, continua a usar NASA POWER.
- `GET /api/location-data?...`: agrega as três fontes para o mesmo ponto do mapa.

## Frontend: exemplo de chamada
```javascript
async function loadMapEnvironmentalData(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude)
  });
  const response = await fetch(`/api/location-data?${params}`);
  const result = await response.json();
  if (!response.ok && response.status !== 503) {
    throw new Error(result.error || "Falha ao consultar os dados da localização");
  }
  return result;
}

// Exemplo: no evento de clique do mapa:
// map.on("click", async (event) => {
//   const { lat, lng } = event.latlng;
//   const environmentalData = await loadMapEnvironmentalData(lat, lng);
//   renderEnvironmentalPanel(environmentalData);
// });
```

## Configuração
Copie `.env.example` para `.env` e configure `METEOMATICS_USERNAME` e
`METEOMATICS_PASSWORD` com credenciais válidas. Não coloque credenciais no
JavaScript/frontend nem no repositório.

## Notas de dados
- NASA POWER: média dos últimos 30 dias completos, conforme serviço já existente.
- Meteomatics: previsão horária para as próximas 24 horas; requer credenciais.
- SoilGrids: propriedades estimadas na camada de 0–5 cm. O serviço REST do ISRIC
  está sujeito a indisponibilidades; o endpoint devolve o estado individual de cada fonte.
- As APIs podem ter resoluções espaciais diferentes. Usar as mesmas coordenadas
  não significa que os dados representem exactamente a mesma área/resolução.


## Frontend ligado ao endpoint

O `frontend/js/app.js` chama automaticamente `/api/location-data` sempre que
o utilizador clica no mapa. O painel ambiental mostra o estado individual de
NASA POWER, Meteomatics e SoilGrids. Se uma API falhar, as restantes continuam
a ser apresentadas. A submissão do formulário de rotação continua a chamar
`POST /api/analyze`, que usa NASA POWER para alimentar o motor de recomendação.

A consulta ambiental aceita respostas HTTP 200 e 503: o código 503 significa
que nenhuma das fontes conseguiu fornecer dados, mas a interface continua
operacional e mostra o estado de cada serviço.
