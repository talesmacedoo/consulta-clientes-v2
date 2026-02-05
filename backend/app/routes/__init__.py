from .calculadora_routes import calculadora_bp
from .cliente_routes import cliente_bp
#from .bancos_routes import bancos_bp
#from .ia_routes import ia_bp
#from .mensagens_routes import mensagens_bp

def register_routes(app):
    app.register_blueprint(calculadora_bp)
    app.register_blueprint(cliente_bp)
    #app.register_blueprint(bancos_bp)
    #app.register_blueprint(ia_bp)
    #app.register_blueprint(mensagens_bp)
