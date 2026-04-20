import requests
from datetime import datetime
from flask import current_app
from app.models.cliente import Cliente

def _limpar_cpf(cpf: str) -> str:
    return cpf.replace(".", "").replace("-", "").replace(" ", "")


def _limpar_telefone(telefone: str) -> str:
    return (
        telefone.replace("(", "")
        .replace(")", "")
        .replace("-", "")
        .replace(" ", "")
    )


import re

def check_blacklist(query: str) -> bool:
    if not query:
        return False
    try:
        # Remove caracteres não numéricos para a consulta
        query_clean = re.sub(r"\D", "", query)
        api_base = current_app.config.get("API_BASE_URL", "http://192.168.1.60:5001")
        response = requests.get(f"{api_base}/blacklist/buscar", params={"q": query_clean}, timeout=3)
        if response.status_code == 200:
            data = response.json()
            return len(data.get("results", [])) > 0
    except Exception as e:
        print(f"Erro ao consultar blacklist: {e}")
    return False

def check_sem_interesse(query: str) -> bool:
    if not query:
        return False
    try:
        # Remove caracteres não numéricos para a consulta
        query_clean = re.sub(r"\D", "", query)
        api_base = current_app.config.get("API_BASE_URL", "http://192.168.1.60:5001")
        response = requests.get(f"{api_base}/si/buscar", params={"q": query_clean}, timeout=3)
        if response.status_code == 200:
            data = response.json()
            resultados = data.get("results", [])
            if resultados:
                return True
    except Exception as e:
        print(f"Erro ao consultar sem_interesse: {e}")
    return False

def consultar_cliente(cpf: str | None = None, telefone: str | None = None):
    if not cpf and not telefone:
        return None

    cliente = None

    if cpf:
        cpf = _limpar_cpf(cpf)
        cliente = Cliente.get_or_none(Cliente.cpf == cpf)

    elif telefone:
        telefone = _limpar_telefone(telefone)
        cliente = Cliente.get_or_none(Cliente.celular1 == telefone)

    if not cliente:
        return None

    # Preparar dados para JSON
    data_nascimento = None
    if cliente.data_nascimento:
        data_nascimento = cliente.data_nascimento

    data_consulta = None
    if cliente.data_consulta:
        data_consulta = cliente.data_consulta

    return {
        "id": cliente.id,
        "nome": cliente.nome,
        "cpf": cliente.cpf,
        "telefone": cliente.celular1,
        "data_nascimento": data_nascimento,
        "data_consulta": data_consulta,
    }
