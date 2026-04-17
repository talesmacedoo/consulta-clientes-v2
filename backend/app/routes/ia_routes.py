from flask import Blueprint, jsonify, request

ia_bp = Blueprint("ia", __name__, url_prefix="/ia")


@ia_bp.route("/analisar", methods=["POST"])
def analisar():
    payload = request.json or {}
    texto = payload.get("texto", "")

    # Endpoint temporário para manter contrato API explícito.
    return jsonify({
        "error": "Endpoint de IA ainda não implementado",
        "texto_recebido": bool(texto)
    }), 501
