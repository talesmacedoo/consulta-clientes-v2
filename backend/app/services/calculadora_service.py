from datetime import datetime
from dateutil.relativedelta import relativedelta
from math import pow


def calcular_quitacao(dados):
    valor_parcela = dados["valorParcela"]
    quantidade_antecipar = dados["totalParcelas"]
    juros_mensal = dados["jurosMensal"] / 100
    dia_vencimento = dados["diaVencimento"]

    data_assinatura = datetime.strptime(dados["dataAssinatura"], "%Y-%m-%d")
    data_quitacao = datetime.strptime(dados["dataQuitacao"], "%Y-%m-%d")

    parcelas = []
    valor_quitacao = 0

    vencimento = data_assinatura + relativedelta(months=1)
    vencimento = vencimento.replace(day=dia_vencimento)

    while vencimento <= data_quitacao:
        vencimento += relativedelta(months=1)

    for i in range(quantidade_antecipar):
        dias = (vencimento - data_quitacao).days
        fator = pow(1 + juros_mensal, dias / 30)
        valor_presente = valor_parcela / fator
        valor_quitacao += valor_presente

        parcelas.append({
            "numero": i + 1,
            "vencimento": vencimento.strftime("%d/%m/%Y"),
            "valorOriginal": round(valor_parcela, 2),
            "valorPresente": round(valor_presente, 2),
        })

        vencimento += relativedelta(months=1)

    total_nominal = round(valor_parcela * quantidade_antecipar, 2)
    economia = round(total_nominal - valor_quitacao, 2)

    return {
        "valorQuitacao": round(valor_quitacao, 2),
        "economiaObtida": economia,
        "totalNominal": total_nominal,
        "percentualEconomizado": round((economia / total_nominal * 100), 2) if total_nominal else 0,
        "descontoMedioParcela": round(economia / quantidade_antecipar, 2) if quantidade_antecipar else 0,
        "parcelas": parcelas,
    }