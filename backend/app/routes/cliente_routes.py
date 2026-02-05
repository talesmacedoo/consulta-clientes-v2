from flask import Blueprint, request, jsonify
from app.services.cliente_service import consultar_cliente

cliente_bp = Blueprint("cliente", __name__, url_prefix="/cliente")

@cliente_bp.route("/consultar", methods=["GET"])
def consultar():
    #dados = request.json
    resultado = consultar_cliente("dados")
    return {"status": "Consultado"} #jsonify(resultado)
