from datetime import date, timedelta
import requests

PARAMETERS = "T2M,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN"
class NasaPowerError(Exception): pass

def fetch_climate(latitude, longitude, base_url, timeout=15, end_date=None):
    """Fetches the last 30 complete days. Coordinates are used only for this request."""
    end = end_date or (date.today() - timedelta(days=2))
    start = end - timedelta(days=29)
    params = {"parameters": PARAMETERS, "community": "AG", "longitude": round(float(longitude), 2),
              "latitude": round(float(latitude), 2), "start": start.strftime("%Y%m%d"),
              "end": end.strftime("%Y%m%d"), "format": "JSON"}
    try:
        response = requests.get(base_url, params=params, timeout=timeout)
        response.raise_for_status()
        body = response.json()
        values = body.get("properties", {}).get("parameter", {})
        if not values: raise NasaPowerError("A NASA POWER não devolveu valores para esta localização.")
        def valid_mean(key):
            vals = [float(v) for v in values.get(key, {}).values() if v is not None and float(v) > -900]
            return round(sum(vals)/len(vals), 2) if vals else None
        return {"temperature_c":valid_mean("T2M"), "precipitation_mm_day":valid_mean("PRECTOTCORR"),
                "relative_humidity_pct":valid_mean("RH2M"), "solar_radiation_mj_m2_day":valid_mean("ALLSKY_SFC_SW_DWN"),
                "period":{"start":start.isoformat(),"end":end.isoformat()},
                "source":"NASA POWER API", "retrieved_at":date.today().isoformat(),
                "resolution_note":"Dados diários agregados numa janela de 30 dias; representam a zona, não a parcela exacta."}
    except (requests.RequestException, ValueError, KeyError) as exc:
        raise NasaPowerError(f"Não foi possível obter dados da NASA POWER: {exc}") from exc
