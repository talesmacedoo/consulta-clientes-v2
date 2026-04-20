from flask import Blueprint, request, jsonify
from app.services.cliente_service import consultar_cliente, check_blacklist, check_sem_interesse

cliente_bp = Blueprint("cliente", __name__, url_prefix="/clientes")


@cliente_bp.route("/consultar", methods=["GET"])
def consultar():
    cpf = request.args.get("cpf")
    telefone = request.args.get("telefone")

    if not cpf and not telefone:
        return jsonify({
            "error": "Informe cpf ou telefone"
        }), 400
        
    termo = cpf if cpf else telefone
    
    # 1. Verifica na Blacklist
    if check_blacklist(termo):
        return jsonify({
            "found": False,
            "message": "Cliente listado em base da Blacklist. Não prossiga com o contato.",
            "is_blacklist": True
        }), 403

    # 2. Busca na base local
    cliente = consultar_cliente(cpf=cpf, telefone=telefone)
    if not cliente:
        return jsonify({
            "found": False,
            "message": "Cliente não encontrado"
        }), 404

    # 3. Verifica Sem Interesse
    is_si = check_sem_interesse(termo)
    
    return jsonify({
        "found": True,
        "cliente": cliente,
        "sem_interesse": is_si,
        "message": "Atenção: cliente relatou não ter interesse nos últimos 10 dias." if is_si else ""
    })

@cliente_bp.route("/verificar-restricoes", methods=["GET"])
def verificar_restricoes():
    telefone = request.args.get("telefone")
    if not telefone:
        return jsonify({"error": "Informe o telefone"}), 400
    
    if check_blacklist(telefone):
        return jsonify({"bloqueado": True, "motivo": "blacklist"}), 200
        
    if check_sem_interesse(telefone):
        return jsonify({"bloqueado": False, "aviso": "sem_interesse"}), 200
        
    return jsonify({"bloqueado": False}), 200
