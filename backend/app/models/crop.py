from ..extensions import db

class Crop(db.Model):
    __tablename__ = "crops"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    family = db.Column(db.String(50), nullable=False)
    water_need = db.Column(db.Integer, nullable=False)  # 1 low .. 5 high
    drought_tolerance = db.Column(db.Integer, nullable=False)  # 1 low .. 5 high
    fixes_nitrogen = db.Column(db.Boolean, nullable=False, default=False)
    cycle_days = db.Column(db.Integer, nullable=False)
    preferred_soils = db.Column(db.String(160), nullable=False)

    def as_dict(self):
        return {"id":self.id,"name":self.name,"family":self.family,"water_need":self.water_need,
                "drought_tolerance":self.drought_tolerance,"fixes_nitrogen":self.fixes_nitrogen,
                "cycle_days":self.cycle_days,"preferred_soils":self.preferred_soils.split(",")}
