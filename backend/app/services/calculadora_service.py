from datetime import datetime, timedelta

def calcular_quitacao(dados):
    valor_parcela = dados["valorContrato"]
    parcelas_restantes = dados["parcelasRestantes"]
    juros_mensal = dados["jurosMensal"] / 100
    simular_desconto = dados.get("simularDesconto", False)

    parcelas = []
    valor_quitacao = 0

    hoje = datetime.today()

    for i in range(1, parcelas_restantes + 1):
        vencimento = hoje + timedelta(days=30 * i)

        valor_presente = valor_parcela / ((1 + juros_mensal) ** i)
        valor_quitacao += valor_presente

        parcelas.append({
            "numero": i,
            "vencimento": vencimento.strftime("%d/%m/%Y"),
            "valorOriginal": round(valor_parcela, 2),
            "valorPresente": round(valor_presente, 2)
        })

    juros_economizados = (valor_parcela * parcelas_restantes) - valor_quitacao

    desconto_aplicado = 0
    if simular_desconto:
        desconto_aplicado = valor_quitacao * 0.05
        valor_quitacao -= desconto_aplicado

    return {
        "valorQuitacao": round(valor_quitacao, 2),
        "economiaObtida": round(juros_economizados + desconto_aplicado, 2),
        "detalhes": {
            "valorOriginal": round(valor_parcela * parcelas_restantes, 2),
            "jurosEconomizados": round(juros_economizados, 2),
            "descontoAplicado": round(desconto_aplicado, 2) if simular_desconto else None
        },
        "parcelas": parcelas
    }
