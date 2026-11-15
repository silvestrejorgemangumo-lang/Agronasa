from math import isfinite

SOILS = {"arenoso", "franco", "argiloso"}
PRIORITIES = {"poupar_agua", "recuperar_solo", "maximizar_producao"}

def validate_analysis(payload):
    errors = []
    if not isinstance(payload, dict): return ["O corpo do pedido deve ser um objecto JSON."]
    try:
        lat, lon = float(payload.get("latitude")), float(payload.get("longitude"))
        if not (isfinite(lat) and -90 <= lat <= 90): errors.append("Latitude inválida.")
        if not (isfinite(lon) and -180 <= lon <= 180): errors.append("Longitude inválida.")
    except (TypeError, ValueError):
        errors.append("Indique latitude e longitude numéricas.")
    if payload.get("soil_type") not in SOILS: errors.append("Seleccione um tipo de solo válido.")
    if payload.get("priority") not in PRIORITIES: errors.append("Seleccione uma prioridade válida.")
    previous = payload.get("previous_crops", [])
    if not isinstance(previous, list) or len(previous) > 5: errors.append("Indique até cinco culturas anteriores.")
    return errors
