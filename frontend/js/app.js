const translations = {
  pt: {
    workspace:"ESPAÇO DE TRABALHO", navAnalysis:"Análise agrícola", navResults:"Resultados", navMap:"Mapa",
    dataStatus:"Fontes de dados disponíveis", topEyebrow:"PLATAFORMA DE AGRICULTURA INTELIGENTE",
    topTitle:"Painel de controlo", profile:"Perfil", farmer:"Agricultor", account:"A minha conta",
    profileOption:"Ver perfil", settings:"Definições", overview:"VISÃO GERAL",
    pageTitle:"Analisar uma zona agrícola", pageDescription:"Explore as condições climáticas e descubra estratégias de rotação adequadas à sua propriedade.",
    country:"Moçambique", locationTitle:"Localização agrícola",
    searchPlaceholder:"Ex.: Maputo ou -25.97, 32.58", searchButton:"Pesquisar",
    searchingPlaces:"A pesquisar locais…", noPlacesFound:"Nenhum local encontrado.",
    placeSearchError:"Não foi possível pesquisar locais. Verifique a ligação à internet e tente novamente.",
    invalidCoordinates:"Coordenadas inválidas. Use latitude entre -90 e 90 e longitude entre -180 e 180.",
    environmentTitle:"Dados ambientais da localização", environmentHelp:"Selecione um ponto no mapa para consultar as três fontes.",
    waiting:"À espera do mapa", loadingSources:"A consultar fontes…", environmentEmpty:"Ainda não existem dados para apresentar.",
    sourceNASA:"NASA POWER · Clima histórico", sourceMeteo:"Meteomatics · Previsão", sourceSoil:"SoilGrids · Propriedades do solo",
    available:"Disponível", unavailableSource:"Indisponível", partial:"Parcial", noData:"Sem dados disponíveis",
    soilPH:"pH do solo (valor bruto ×10)", soilClay:"Argila (g/kg)", soilSand:"Areia (g/kg)", soilSOC:"Carbono orgânico (g/kg)",
    meteoTemp:"Temperatura prevista", meteoHumidity:"Humidade prevista", meteoRain:"Precipitação horária", meteoWind:"Velocidade do vento",
    environmentalNote:"Os valores são estimativas/modelos para a zona selecionada, não medições exatas da parcela.",
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
    searchPlaceholder:"E.g. Maputo or -25.97, 32.58", searchButton:"Search",
    searchingPlaces:"Searching places…", noPlacesFound:"No locations found.",
    placeSearchError:"Could not search for places. Check your internet connection and try again.",
    invalidCoordinates:"Invalid coordinates. Use latitude between -90 and 90 and longitude between -180 and 180.",
    environmentTitle:"Environmental data for this location", environmentHelp:"Select a point on the map to query all three sources.",
    waiting:"Waiting for map", loadingSources:"Querying sources…", environmentEmpty:"No data to display yet.",
    sourceNASA:"NASA POWER · Historical climate", sourceMeteo:"Meteomatics · Forecast", sourceSoil:"SoilGrids · Soil properties",
    available:"Available", unavailableSource:"Unavailable", partial:"Partial", noData:"No data available",
    soilPH:"Soil pH (raw value ×10)", soilClay:"Clay (g/kg)", soilSand:"Sand (g/kg)", soilSOC:"Organic carbon (g/kg)",
    meteoTemp:"Forecast temperature", meteoHumidity:"Forecast humidity", meteoRain:"Hourly precipitation", meteoWind:"Wind speed",
    environmentalNote:"Values are model estimates for the selected area, not exact measurements of the field.",
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
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[language][key]) el.placeholder = translations[language][key];
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
const locationSearchForm = document.getElementById("location-search");
const locationQuery = document.getElementById("location-query");
const locationSuggestions = document.getElementById("location-suggestions");
const searchStatus = document.getElementById("search-status");
const photonSearchUrl = "https://photon.komoot.io/api/";
let geocodeController = null;
let suggestionTimer = null;

function choose(latlng) {
  selected = {latitude:Number(latlng.lat.toFixed(4)), longitude:Number(latlng.lng.toFixed(4))};
  if (marker) marker.remove();
  marker = L.marker(latlng).addTo(map);
  document.getElementById("coords").textContent =
    `${currentLanguage === "pt" ? "Local seleccionado" : "Selected location"}: ${selected.latitude}, ${selected.longitude}`;
}

function parseCoordinates(query) {
  const match = query.trim().match(/^(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return {invalid:true};
  }
  return {latitude, longitude};
}

function selectLocation(latitude, longitude, zoom = 12) {
  const latlng = L.latLng(latitude, longitude);
  map.setView(latlng, zoom);
  choose(latlng);
  loadEnvironmentalData(selected.latitude, selected.longitude);
}

function closeLocationSuggestions() {
  locationSuggestions.replaceChildren();
  locationSuggestions.hidden = true;
}

function formatPlaceName(properties) {
  return [properties.name, properties.city || properties.locality, properties.state, properties.country]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .join(", ");
}

function showLocationSuggestions(features) {
  locationSuggestions.replaceChildren();
  features.forEach(feature => {
    const [longitude, latitude] = feature.geometry.coordinates;
    const label = formatPlaceName(feature.properties);
    if (!label || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    const option = document.createElement("button");
    option.type = "button";
    option.className = "location-suggestion";
    option.setAttribute("role", "option");
    option.textContent = label;
    option.addEventListener("click", () => {
      locationQuery.value = label;
      searchStatus.textContent = "";
      closeLocationSuggestions();
      selectLocation(latitude, longitude);
    });
    locationSuggestions.append(option);
  });
  locationSuggestions.hidden = locationSuggestions.childElementCount === 0;
}

async function searchPlaces(query, selectFirst = false) {
  if (geocodeController) geocodeController.abort();
  geocodeController = new AbortController();
  const controller = geocodeController;
  searchStatus.textContent = t("searchingPlaces");
  try {
    const params = new URLSearchParams({
      q:query,
      limit:"5",
      lat:"-18.6657",
      lon:"35.5296"
    });
    const response = await fetch(`${photonSearchUrl}?${params}`, {signal:controller.signal});
    if (!response.ok) throw new Error(t("placeSearchError"));
    const data = await response.json();
    if (controller !== geocodeController) return;
    const features = Array.isArray(data.features) ? data.features : [];
    if (!features.length) {
      closeLocationSuggestions();
      searchStatus.textContent = t("noPlacesFound");
      return;
    }
    if (selectFirst) {
      const [longitude, latitude] = features[0].geometry.coordinates;
      const label = formatPlaceName(features[0].properties);
      locationQuery.value = label || query;
      closeLocationSuggestions();
      searchStatus.textContent = "";
      selectLocation(latitude, longitude);
      return;
    }
    showLocationSuggestions(features);
    searchStatus.textContent = "";
  } catch (error) {
    if (error.name === "AbortError") return;
    closeLocationSuggestions();
    searchStatus.textContent = t("placeSearchError");
  }
}

locationSearchForm.addEventListener("submit", event => {
  event.preventDefault();
  clearTimeout(suggestionTimer);
  const query = locationQuery.value.trim();
  if (!query) return;
  const coordinates = parseCoordinates(query);
  if (coordinates?.invalid) {
    if (geocodeController) geocodeController.abort();
    geocodeController = null;
    closeLocationSuggestions();
    searchStatus.textContent = t("invalidCoordinates");
  } else if (coordinates) {
    if (geocodeController) geocodeController.abort();
    geocodeController = null;
    closeLocationSuggestions();
    searchStatus.textContent = "";
    selectLocation(coordinates.latitude, coordinates.longitude);
  } else {
    searchPlaces(query, true);
  }
});

locationQuery.addEventListener("input", () => {
  clearTimeout(suggestionTimer);
  if (geocodeController) geocodeController.abort();
  geocodeController = null;
  searchStatus.textContent = "";
  const query = locationQuery.value.trim();
  const coordinates = parseCoordinates(query);
  if (coordinates) {
    closeLocationSuggestions();
    if (coordinates.invalid) searchStatus.textContent = t("invalidCoordinates");
    return;
  }
  if (query.length < 3) {
    if (geocodeController) geocodeController.abort();
    closeLocationSuggestions();
    return;
  }
  suggestionTimer = setTimeout(() => searchPlaces(query), 350);
});

document.addEventListener("click", event => {
  if (!event.target.closest(".location-search-wrap")) closeLocationSuggestions();
});

let environmentalRequest = null;
map.on("click", e => {
  if (geocodeController) geocodeController.abort();
  geocodeController = null;
  closeLocationSuggestions();
  choose(e.latlng);
  loadEnvironmentalData(selected.latitude, selected.longitude);
});

async function loadEnvironmentalData(latitude, longitude) {
  if (environmentalRequest) environmentalRequest.abort();
  environmentalRequest = new AbortController();
  const status = document.getElementById("environment-status");
  const container = document.getElementById("environment-data");
  status.textContent = t("loadingSources");
  status.className = "source-badge loading";
  container.innerHTML = `<p class="muted">${t("loadingSources")}</p>`;
  document.getElementById("environment-note").textContent = "";
  const params = new URLSearchParams({latitude:String(latitude), longitude:String(longitude)});
  try {
    const response = await fetch(`/api/location-data?${params}`, {signal:environmentalRequest.signal});
    const data = await response.json();
    if (!response.ok && response.status !== 503) {
      throw new Error(data.error || t("failure"));
    }
    renderEnvironmentalData(data);
  } catch (error) {
    if (error.name === "AbortError") return;
    status.textContent = t("unavailableSource");
    status.className = "source-badge unavailable";
    container.textContent = error.message || t("failure");
  }
}

function renderEnvironmentalData(data) {
  const sources = data.sources || {};
  const names = [
    ["nasa_power", t("sourceNASA")],
    ["meteomatics", t("sourceMeteo")],
    ["soilgrids", t("sourceSoil")]
  ];
  const available = (data.available_sources || []).length;
  const status = document.getElementById("environment-status");
  status.textContent = `${available}/3 ${t("available").toLowerCase()}`;
  status.className = `source-badge ${available ? "available" : "unavailable"}`;
  document.getElementById("environment-data").innerHTML = names.map(([key, label]) => {
    const source = sources[key] || {};
    const ok = source.status === "ok";
    const badge = ok ? (source.data?.partial ? t("partial") : t("available")) : t("unavailableSource");
    let details = "";
    if (ok && key === "nasa_power") {
      const d = source.data || {};
      details = metric(t("temp"), d.temperature_c, "°C") +
        metric(t("rain"), d.precipitation_mm_day, "mm/day") +
        metric(t("humidity"), d.relative_humidity_pct, "%") +
        metric(t("radiation"), d.solar_radiation_mj_m2_day, "MJ/m²/day");
    } else if (ok && key === "meteomatics") {
      const p = source.data?.parameters || {};
      details = metric(t("meteoTemp"), latest(p["t_2m:C"]), "°C") +
        metric(t("meteoHumidity"), latest(p["relative_humidity_2m:p"]), "%") +
        metric(t("meteoRain"), latest(p["precip_1h:mm"]), "mm") +
        metric(t("meteoWind"), latest(p["wind_speed_10m:ms"]), "m/s");
    } else if (ok && key === "soilgrids") {
      const p = source.data?.properties || {};
      details = metric(t("soilPH"), p.phh2o, "") +
        metric(t("soilClay"), p.clay, "") +
        metric(t("soilSand"), p.sand, "") +
        metric(t("soilSOC"), p.soc, "");
    } else {
      details = `<p class="source-error">${escapeHTML(source.error || t("noData"))}</p>`;
    }
    return `<article class="source-card">
      <div class="source-card-heading"><strong>${label}</strong><span class="source-badge ${ok ? "available" : "unavailable"}">${badge}</span></div>
      <div class="source-metrics">${details}</div>
    </article>`;
  }).join("");
  document.getElementById("environment-note").textContent =
    data.notice || t("environmentalNote");
}

function latest(series) {
  if (!Array.isArray(series) || !series.length) return null;
  const valid = series.filter(item => item.value !== null && item.value !== undefined);
  return valid.length ? valid[valid.length - 1].value : null;
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

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
