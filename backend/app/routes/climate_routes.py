from flask import Blueprint, current_app, request
from ..services.nasa_power import fetch_climate, NasaPowerError
bp=Blueprint("climate",__name__)
@bp.get("/climate")
def climate():
    try:
        lat=float(request.args.get("latitude")); lon=float(request.args.get("longitude"))
        if not -90<=lat<=90 or not -180<=lon<=180: raise ValueError()
    except (TypeError,ValueError): return {"error":"Coordenadas inválidas."},400
    try:
        data=fetch_climate(lat,lon,current_app.config["NASA_POWER_BASE_URL"],current_app.config["NASA_TIMEOUT"])
        return {"data":data}
    except NasaPowerError as exc: return {"error":str(exc)},502
