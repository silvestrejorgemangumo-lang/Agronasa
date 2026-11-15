from flask import Flask, send_from_directory
from flask_cors import CORS
from pathlib import Path
from .config import Config
from .extensions import db
from .routes.health_routes import bp as health_bp
from .routes.crop_routes import bp as crop_bp
from .routes.climate_routes import bp as climate_bp
from .routes.analysis_routes import bp as analysis_bp

FRONTEND = Path(__file__).resolve().parents[2] / "frontend"

def create_app(test_config=None):
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    from . import models  # register SQLAlchemy models
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(crop_bp, url_prefix="/api")
    app.register_blueprint(climate_bp, url_prefix="/api")
    app.register_blueprint(analysis_bp, url_prefix="/api")
    with app.app_context():
        db.create_all()  # MVP; em produção, substituir por migrações Alembic.

    @app.get("/")
    def index():
        return send_from_directory(FRONTEND, "index.html")

    @app.get("/assets/<path:filename>")
    def assets(filename):
        return send_from_directory(FRONTEND, filename)

    @app.errorhandler(404)
    def not_found(_):
        return {"error": "Recurso não encontrado."}, 404

    @app.errorhandler(500)
    def server_error(_):
        return {"error": "Ocorreu um erro interno. Tente novamente."}, 500

    return app
