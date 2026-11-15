from flask import Blueprint, request, current_app
from ..utils.validators import validate_analysis
from ..services.nasa_power import fetch_climate, NasaPowerError
from ..services.rotation_engine import recommend
from ..models import Crop
from ..extensions import db
import json
from pathlib import Path
bp=Blueprint("analysis",__name__)
def get_crops():
    if Crop.query.count()==0:
        seed=Path(__file__).resolve().parents[1]/"data"/"seed_crops.json"
        for item in json.loads(seed.read_text(encoding="utf-8")): db.session.add(Crop(**item))
        db.session.commit()
    return [c.as_dict() for c in Crop.query.all()]
@bp.post("/analyze")
def analyze():
    payload=request.get_json(silent=True) or {}
    errors=validate_analysis(payload)
    if errors: return {"errors":errors},400
    climate=None; warning=None
    try:
        climate=fetch_climate(payload["latitude"],payload["longitude"],current_app.config["NASA_POWER_BASE_URL"],current_app.config["NASA_TIMEOUT"])
    except NasaPowerError as exc:
        warning=str(exc)
    crops=get_crops()
    results=recommend(crops,payload["soil_type"],payload.get("previous_crops",[]),payload["priority"],climate)
    # Coordinates are intentionally not persisted or returned in the response.
    return {"climate":climate,"strategies":results,"warning":warning,
      "notice":"A análise descreve condições da zona e não substitui análise laboratorial do solo nem aconselhamento agronómico local.",
      "sources":["NASA POWER API" if climate else "NASA POWER indisponível; regras locais utilizadas","Catálogo de culturas AgroSmart"]}
