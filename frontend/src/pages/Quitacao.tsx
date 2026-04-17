import { useState } from 'react';
import { Calculator, Download, Percent, TrendingDown, Banknote, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calcularQuitacao, type QuitacaoRequest, type QuitacaoResponse } from '@/services/api';
import { exportarPNG } from '@/utils/exportarPNG';

const Quitacao = () => {
  const [formData, setFormData] = useState<QuitacaoRequest>({
    dataAssinatura: '',
    valorParcela: 0,
    jurosMensal: 0,
    diaVencimento: 0,
    dataQuitacao: '',
    totalParcelas: 0,
  });

  const [resultado, setResultado] = useState<QuitacaoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabelaAberta, setTabelaAberta] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await calcularQuitacao(formData);
      setResultado(response);
      setTabelaAberta(false);
    } catch {
      setError('Erro ao calcular quitação. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!resultado) return;
    setExporting(true);
    try {
      await exportarPNG(resultado, formData);
    } catch {
      setError('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  const pctPago = resultado
    ? resultado.valorQuitacao / resultado.totalNominal
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Calculadora de Quitação Antecipada
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Resultado meramente informativo. Compare sempre com o cálculo da instituição financeira.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Contrato</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Data de Assinatura</Label>
                <Input
                  type="date"
                  name="dataAssinatura"
                  value={formData.dataAssinatura}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Valor da Parcela</Label>
                <Input
                  type="number"
                  name="valorParcela"
                  value={formData.valorParcela || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Taxa de Juros (ao mês)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    name="jurosMensal"
                    value={formData.jurosMensal || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dia do Vencimento</Label>
                <Input
                  type="number"
                  name="diaVencimento"
                  value={formData.diaVencimento || ''}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Quantidade Total de Parcelas</Label>
                <Input
                  type="number"
                  name="totalParcelas"
                  value={formData.totalParcelas || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Quitação</Label>
                <Input
                  type="date"
                  name="dataQuitacao"
                  value={formData.dataQuitacao}
                  onChange={handleInputChange}
                  required
                />
              </div>

            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Calculando...' : 'Calcular'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Resultado</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={exporting}
            >
              {exporting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando...</>
                : <><Download className="w-4 h-4 mr-2" />Salvar imagem</>
              }
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Valor principal */}
            <div className="p-4 bg-primary/5 rounded-lg border">
              <p className="text-sm text-muted-foreground">Valor Total para Quitação</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {formatCurrency(resultado.valorQuitacao)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Data-base: {formData.dataQuitacao.split('-').reverse().join('/')}
              </p>
            </div>

            {/* Barra proporcional */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Valor a quitar vs. total nominal</span>
                <span>{resultado.percentualEconomizado}% economizado</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${Math.min(pctPago * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(resultado.valorQuitacao)}</span>
                <span>de {formatCurrency(resultado.totalNominal)}</span>
              </div>
            </div>

            {/* Cards de métricas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border bg-green-500/5 border-green-500/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                  <p className="text-xs text-muted-foreground">Juros economizados</p>
                </div>
                <p className="text-base font-semibold text-green-600">
                  {formatCurrency(resultado.economiaObtida)}
                </p>
              </div>

              <div className="p-3 rounded-lg border bg-destructive/5 border-destructive/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <Banknote className="w-3.5 h-3.5 text-destructive" />
                  <p className="text-xs text-muted-foreground">Total nominal</p>
                </div>
                <p className="text-base font-semibold text-destructive">
                  {formatCurrency(resultado.totalNominal)}
                </p>
              </div>

              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-1.5 mb-1">
                  <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">% economizado</p>
                </div>
                <p className="text-base font-semibold">{resultado.percentualEconomizado}%</p>
              </div>

              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Desconto médio/parcela</p>
                <p className="text-base font-semibold">
                  {formatCurrency(resultado.descontoMedioParcela)}
                </p>
              </div>

              <div className="p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">Parcelas antecipadas</p>
                <p className="text-base font-semibold">{resultado.parcelas.length}</p>
                <p className="text-xs text-muted-foreground">
                  até {resultado.parcelas.at(-1)?.vencimento}
                </p>
              </div>

              <div className="p-3 rounded-lg border bg-green-500/5 border-green-500/20">
                <p className="text-xs text-muted-foreground mb-1">Economia/mês antecipado</p>
                <p className="text-base font-semibold text-green-600">
                  {formatCurrency(resultado.economiaObtida / resultado.parcelas.length)}
                </p>
              </div>
            </div>

            {/* Tabela recolhível */}
            <div>
              <button
                type="button"
                onClick={() => setTabelaAberta((v) => !v)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
              >
                {tabelaAberta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {tabelaAberta ? 'Ocultar' : 'Ver'} detalhamento por parcela
              </button>

              {tabelaAberta && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="text-left">#</th>
                        <th className="text-left">Data Vencimento</th>
                        <th className="text-right">Valor Parcela</th>
                        <th className="text-right">Valor Presente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.parcelas.map((p) => (
                        <tr key={p.numero} className="border-t">
                          <td>{p.numero}</td>
                          <td>{p.vencimento}</td>
                          <td className="text-right">{formatCurrency(p.valorOriginal)}</td>
                          <td className="text-right font-medium text-primary">
                            {formatCurrency(p.valorPresente)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quitacao;
