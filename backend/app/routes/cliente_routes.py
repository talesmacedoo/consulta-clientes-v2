from flask import Blueprint, request, jsonify
from app.services.cliente_service import consultar_cliente

cliente_bp = Blueprint("cliente", __name__, url_prefix="/clientes")


@cliente_bp.route("/consultar", methods=["GET"])
def consultar():
    cpf = request.args.get("cpf")
    telefone = request.args.get("telefone")

    if not cpf and not telefone:
        return jsonify({
            "error": "Informe cpf ou telefone"
        }), 400

    cliente = consultar_cliente(cpf=cpf, telefone=telefone)
    print(cliente)
    if not cliente:
        return jsonify({
            "found": False,
            "message": "Cliente não encontrado"
        }), 404

    return jsonify({
        "found": True,
        "cliente": cliente
    })

