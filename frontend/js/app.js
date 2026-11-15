const translations = {
  pt: {
    workspace:"ESPAÇO DE TRABALHO", navAnalysis:"Análise agrícola", navResults:"Resultados", navMap:"Mapa",
    dataStatus:"Fontes de dados disponíveis", topEyebrow:"PLATAFORMA DE AGRICULTURA INTELIGENTE",
    topTitle:"Painel de controlo", profile:"Perfil", farmer:"Agricultor", account:"A minha conta",
    profileOption:"Ver perfil", settings:"Definições", overview:"VISÃO GERAL",
    pageTitle:"Analisar uma zona agrícola", pageDescription:"Explore as condições climáticas e descubra estratégias de rotação adequadas à sua propriedade.",
    country:"Moçambique", locationTitle:"Localização agrícola",
    mapHelp:"Clique no mapa para seleccionar um ponto aproximado. As coordenadas não são guardadas pelo servidor.",
    noLocation:"Nenhuma localização seleccionada.", parameters:"Parâmetros da análise", soilType:"Tipo de solo",
    select:"Seleccione", sandy:"Arenoso", loamy:"Franco", clayey:"Argiloso", priority:"Prioridade",
    saveWater:"Poupar água", restoreSoil:"Recuperar o solo", maximize:"Maximizar produção",
    previousCrops:"Culturas da época anterior", multiSelect:"Pode seleccionar mais de uma cultura (Ctrl/Cmd + clique).",
    submit:"Gerar estratégias de rotação", analyzing:"A analisar…", chooseMap:"Clique primeiro no mapa para escolher a zona.",
    resultsTitle:"Resultado da análise", recommended:"Estratégias recomendadas",
    temp:"Temperatura média", rain:"Precipitação média", humidity:"Humidade relativa", radiation:"Radiação solar",
    unavailable:"Dados climáticos NASA POWER indisponíveis nesta consulta.", option:"Opção",
    water:"Água", soil:"Solo", climate:"Clima", source:"Fontes: ", warning:"Aviso: ",
    footer:"AGRONASA · Apoio à decisão agrícola baseado em dados.", failure:"Falha na análise."
  },
  en: {
    workspace:"WORKSPACE", navAnalysis:"Farm analysis", navResults:"Results", navMap:"Map",
    dataStatus:"Data sources available", topEyebrow:"SMART AGRICULTURE PLATFORM",
    topTitle:"Dashboard", profile:"Profile", farmer:"Farmer", account:"My account",
    profileOption:"View profile", settings:"Settings", overview:"OVERVIEW",
    pageTitle:"Analyze a farming area", pageDescription:"Explore climate conditions and discover crop rotation strategies suited to your farm.",
    country:"Mozambique", locationTitle:"Farm location",
    mapHelp:"Click on the map to select an approximate point. Coordinates are not stored by the server.",
    noLocation:"No location selected.", parameters:"Analysis parameters", soilType:"Soil type",
    select:"Select", sandy:"Sandy", loamy:"Loamy", clayey:"Clayey", priority:"Priority",
    saveWater:"Save water", restoreSoil:"Restore soil", maximize:"Maximize production",
    previousCrops:"Previous season crops", multiSelect:"You can select more than one crop (Ctrl/Cmd + click).",
    submit:"Generate crop rotation strategies", analyzing:"Analyzing…", chooseMap:"Please click the map to choose an area first.",
    resultsTitle:"Analysis results", recommended:"Recommended strategies",
    temp:"Average temperature", rain:"Average precipitation", humidity:"Relative humidity", radiation:"Solar radiation",
    unavailable:"NASA POWER climate data is unavailable for this request.", option:"Option",
    water:"Water", soil:"Soil", climate:"Climate", source:"Sources: ", warning:"Warning: ",
    footer:"AGRONASA · Data-driven agricultural decision support.", failure:"Analysis failed."
  }
};

let currentLanguage = localStorage.getItem("agronasa-language") || "pt";
function t(key) { return translations[currentLanguage][key] || key; }

function applyLanguage(language) {
  currentLanguage = language;
  localStorage.setItem("agronasa-language", language);
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[language][key]) el.textContent = translations[language][key];
  });
  document.getElementById("languageSelect").value = language;
  if (!selected) document.getElementById("coords").textContent = t("noLocation");
}
document.getElementById("languageSelect").addEventListener("change", e => applyLanguage(e.target.value));

const sidebar = document.getElementById("sidebar");
document.getElementById("menuToggle").addEventListener("click", () => sidebar.classList.toggle("open"));
document.addEventListener("click", e => {
  if (window.innerWidth <= 700 && !sidebar.contains(e.target) && !e.target.closest("#menuToggle")) {
    sidebar.classList.remove("open");
  }
});

const profileButton = document.getElementById("profileButton");
const profileMenu = document.getElementById("profileMenu");
profileButton.addEventListener("click", () => {
  const open = profileMenu.classList.toggle("hidden") === false;
  profileButton.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", e => {
  if (!e.target.closest(".profile-wrap")) {
    profileMenu.classList.add("hidden");
    profileButton.setAttribute("aria-expanded", "false");
  }
});

const map = L.map("map").setView([-18.6657, 35.5296], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18, attribution: "© OpenStreetMap"
}).addTo(map);

let marker = null;
let selected = null;
function choose(latlng) {
  selected = {latitude:Number(latlng.lat.toFixed(4)), longitude:Number(latlng.lng.toFixed(4))};
  if (marker) marker.remove();
  marker = L.marker(latlng).addTo(map);
  document.getElementById("coords").textContent =
    `${currentLanguage === "pt" ? "Local seleccionado" : "Selected location"}: ${selected.latitude}, ${selected.longitude}`;
}
map.on("click", e => choose(e.latlng));

const form = document.getElementById("analysis-form");
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!selected) { alert(t("chooseMap")); return; }

  const button = document.getElementById("submit");
  button.disabled = true;
  button.textContent = t("analyzing");

  const payload = {
    ...selected,
    soil_type:document.getElementById("soil").value,
    priority:document.getElementById("priority").value,
    previous_crops:[...document.getElementById("previous").selectedOptions].map(o => o.value)
  };

  try {
    const res = await fetch("/api/analyze", {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      const errors = data.errors || [data.error || t("failure")];
      throw new Error(errors.join(" "));
    }
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    button.disabled = false;
    button.textContent = t("submit");
  }
});

function render(data) {
  document.getElementById("results").classList.remove("hidden");
  document.getElementById("notice").textContent = data.warning
    ? `${t("warning")}${data.warning} ${currentLanguage === "pt" ? "As estratégias foram calculadas com as regras locais." : "Strategies were calculated using local rules."}`
    : (data.notice || "");

  const c = data.climate;
  document.getElementById("climate").innerHTML = c
    ? metric(t("temp"), c.temperature_c, "°C") +
      metric(t("rain"), c.precipitation_mm_day, "mm/day") +
      metric(t("humidity"), c.relative_humidity_pct, "%") +
      metric(t("radiation"), c.solar_radiation_mj_m2_day, "MJ/m²/day")
    : `<p>${t("unavailable")}</p>`;

  document.getElementById("strategies").innerHTML = (data.strategies || []).map((s, i) => `
    <article class="strategy">
      <h4>${t("option")} ${i + 1}: ${s.sequence.join(" → ")}</h4>
      <div class="score">${s.score}/100</div>
      <p>${(s.explanation || []).join("<br>")}</p>
      <small>${t("water")}: ${s.scores.water_saving} | ${t("soil")}: ${s.scores.soil_health} | ${t("climate")}: ${s.scores.climate_resilience}</small>
    </article>`).join("");

  document.getElementById("sources").textContent = t("source") + (data.sources || []).join(" | ");
  document.getElementById("results").scrollIntoView({behavior:"smooth"});
}

function metric(label, value, unit) {
  return `<div class="metric"><span>${label}</span><strong>${value ?? "N/D"} ${value == null ? "" : unit}</strong></div>`;
}

applyLanguage(currentLanguage);
