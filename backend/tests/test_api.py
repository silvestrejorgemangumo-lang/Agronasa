from unittest.mock import patch
SAMPLE={"latitude":-25.97,"longitude":32.58,"soil_type":"franco","priority":"poupar_agua","previous_crops":["Milho"]}
@patch("app.routes.analysis_routes.fetch_climate")
def test_analysis_returns_strategies(mock_fetch,client):
    mock_fetch.return_value={"temperature_c":25,"precipitation_mm_day":1.5,"relative_humidity_pct":60,"solar_radiation_mj_m2_day":20,"period":{},"source":"NASA POWER"}
    response=client.post("/api/analyze",json=SAMPLE)
    assert response.status_code==200
    body=response.get_json()
    assert 1<=len(body["strategies"])<=3
    assert "latitude" not in body and "longitude" not in body
@patch("app.routes.analysis_routes.fetch_climate",side_effect=Exception("unexpected"))
def test_validation_rejects_bad_soil(mock_fetch,client):
    data={**SAMPLE,"soil_type":"unknown"}
    assert client.post("/api/analyze",json=data).status_code==400
def test_health(client): assert client.get("/api/health").get_json()["status"]=="ok"
def test_crops(client): assert len(client.get("/api/crops").get_json()["items"])>=5
