from datetime import datetime
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
