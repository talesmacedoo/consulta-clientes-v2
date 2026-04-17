from flask import Blueprint, jsonify

bancos_bp = Blueprint("bancos", __name__, url_prefix="/bancos")


@bancos_bp.route("/consulta/<cpf>", methods=["GET"])
def consultar_bancos(cpf):
    # Endpoint temporário para manter contrato API explícito.
    return jsonify({
        "error": "Endpoint de bancos ainda não implementado",
        "cpf": cpf
    }), 501
