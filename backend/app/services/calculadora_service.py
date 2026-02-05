def calcular_quitacao(dados):
    valor_total = dados["valor_total"]
    parcelas_restantes = dados["parcelas_restantes"]
    juros = dados["juros_mensal"]

    valor_quitacao = valor_total * (1 + (juros / 100) * parcelas_restantes)
    economia = valor_total - valor_quitacao

    return {
        "valor_quitacao": round(valor_quitacao, 2),
        "economia": round(economia, 2)
    }
