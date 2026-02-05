from flask import Blueprint, request, jsonify
from app.services.calculadora_service import calcular_quitacao

calculadora_bp = Blueprint("calculadora", __name__, url_prefix="/calculadora")

@calculadora_bp.route("/quitacao", methods=["POST"])
def quitacao():
    dados = request.json
    resultado = calcular_quitacao(dados)
    return jsonify(resultado)
