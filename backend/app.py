from flask import Flask
from config import Config
from app.routes import register_routes
from app.database import db
from app.models.cliente import Cliente

db.connect()
db.create_tables([Cliente], safe=True)




def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    register_routes(app)

    @app.route("/")
    def index():
        return {"status": "Backend rodando"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5100)
