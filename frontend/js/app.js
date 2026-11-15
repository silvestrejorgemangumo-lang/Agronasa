/* ==========================================================================
   1. INICIALIZAÇÃO DO MAPA E CAMADA DE TILES (Leaflet.js)
   Cria o mapa centralizado em coordenadas geográficas padrão com zoom inicial 
   e carrega os tiles visuais do OpenStreetMap.
   ========================================================================== */
const map = L.map('map').setView([-18.6657, 35.5296], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap'
}).addTo(map);

/* ==========================================================================
   2. VARIÁVEIS DE ESTADO E FUNÇÃO DE SELEÇÃO NO MAPA
   Armazena o marcador atual e as coordenadas selecionadas. A função 'choose' 
   atualiza o marcador visual no mapa e exibe as coordenadas formatadas na interface.
   ========================================================================== */
let marker = null;
let selected = null;

function choose(latlng) {
  selected = {
    latitude: Number(latlng.lat.toFixed(4)),
    longitude: Number(latlng.lng.toFixed(4))
  };
  
  if (marker) marker.remove();
  marker = L.marker(latlng).addTo(map);
  
  document.getElementById('coords').textContent = `Local seleccionado: ${selected.latitude}, ${selected.longitude}`;
}

map.on('click', e => choose(e.latlng));

/* ==========================================================================
   3. MANIPULAÇÃO DE ENVIO DO FORMULÁRIO (Submit & API Fetch)
   Intercepta o envio do formulário, valida se o local foi selecionado, 
   desativa o botão durante o processamento, envia os dados consolidados via API 
   e lida com possíveis erros ou renderização do resultado.
   ========================================================================== */
const form = document.getElementById('analysis-form');

form.addEventListener('submit', async e => {
  e.preventDefault();
  
  if (!selected) {
    alert('Clique primeiro no mapa para escolher a zona.');
    return;
  }
  
  const button = document.getElementById('submit');
  button.disabled = true;
  button.textContent = 'A analisar…';
  
  const payload = {
    ...selected,
    soil_type: document.getElementById('soil').value,
    priority: document.getElementById('priority').value,
    previous_crops: [...document.getElementById('previous').selectedOptions].map(o => o.value)
  };
  
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error((data.errors || [data.error || 'Falha na análise.']).join(' '));
    
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    button.disabled = false;
    button.textContent = 'Gerar estratégias de rotação';
  }
});

/* ==========================================================================
   4. RENDERIZAÇÃO DOS RESULTADOS NA INTERFACE
   Exibe o painel de resultados, processa os dados climáticos recebidos (ou exibe aviso de indisponibilidade), 
   monta dinamicamente as estratégias de rotação geradas e faz scroll automático para a visualização.
   ========================================================================== */
function render(data) {
  document.getElementById('results').classList.remove('hidden');
  
  document.getElementById('notice').textContent = data.warning 
    ? `Aviso: ${data.warning} As estratégias foram calculadas com as regras locais.` 
    : data.notice;
  
  const c = data.climate;
  
  document.getElementById('climate').innerHTML = c 
    ? metric('Temperatura média', c.temperature_c, '°C') + 
      metric('Precipitação média', c.precipitation_mm_day, 'mm/dia') + 
      metric('Humidade relativa', c.relative_humidity_pct, '%') + 
      metric('Radiação solar', c.solar_radiation_mj_m2_day, 'MJ/m²/dia') 
    : '<p>Dados climáticos NASA POWER indisponíveis nesta consulta.</p>';
  
  document.getElementById('strategies').innerHTML = data.strategies.map((s, i) => `
    <article class="strategy">
      <h4>Opção ${i + 1}: ${s.sequence.join(' → ')}</h4>
      <div class="score">${s.score}/100</div>
      <p>${s.explanation.join('<br>')}</p>
      <small>Água: ${s.scores.water_saving} | Solo: ${s.scores.soil_health} | Clima: ${s.scores.climate_resilience}</small>
    </article>
  `).join('');
  
  document.getElementById('sources').textContent = 'Fontes: ' + data.sources.join(' | ');
  
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   5. FUNÇÃO AUXILIAR DE MÉTRICAS
   Gera o código HTML estruturado para exibir cada indicador/métrica individual.
   ========================================================================== */
function metric(label, value, unit) {
  return `<div class="metric"><span>${label}</span><strong>${value ?? 'N/D'} ${value == null ? '' : unit}</strong></div>`;
}