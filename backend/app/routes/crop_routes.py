from flask import Blueprint, current_app
from ..extensions import db
from ..models import Crop
import json
from pathlib import Path
bp=Blueprint("crops",__name__)
@bp.get("/crops")
def list_crops():
    if Crop.query.count()==0:
        seed=Path(__file__).resolve().parents[1]/"data"/"seed_crops.json"
        for item in json.loads(seed.read_text(encoding="utf-8")): db.session.add(Crop(**item))
        db.session.commit()
    return {"items":[c.as_dict() for c in Crop.query.order_by(Crop.name).all()]}
