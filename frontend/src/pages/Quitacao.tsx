import { useState } from 'react';
import { Calculator, Download, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calcularQuitacao, type QuitacaoRequest, type QuitacaoResponse } from '@/services/api';

const Quitacao = () => {
  const [formData, setFormData] = useState<QuitacaoRequest>({
    valorContrato: 0,
    parcelasPagas: 0,
    parcelasRestantes: 0,
    jurosMensal: 0,
    simularDesconto: false,
  });
  const [resultado, setResultado] = useState<QuitacaoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await calcularQuitacao(formData);
      setResultado(response);
    } catch (err) {
      setError('Erro ao calcular quitação. Verifique os dados e tente novamente.');
      // Mock response for demo

    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    alert('Funcionalidade de exportar PDF em desenvolvimento');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Calculadora de Quitação
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Calcule o valor de quitação antecipada de contratos consignados.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Dados do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorContrato">Valor Total do Contrato</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <Input
                    id="valorContrato"
                    type="number"
                    name="valorContrato"
                    value={formData.valorContrato || ''}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurosMensal">Juros Mensal (%)</Label>
                <div className="relative">
                  <Input
                    id="jurosMensal"
                    type="number"
                    name="jurosMensal"
                    value={formData.jurosMensal || ''}
                    onChange={handleInputChange}
                    className="pr-10"
                    placeholder="0,00"
                    step="0.01"
                    required
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parcelasPagas">Parcelas Pagas</Label>
                <Input
                  id="parcelasPagas"
                  type="number"
                  name="parcelasPagas"
                  value={formData.parcelasPagas || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parcelasRestantes">Parcelas Restantes</Label>
                <Input
                  id="parcelasRestantes"
                  type="number"
                  name="parcelasRestantes"
                  value={formData.parcelasRestantes || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Discount Toggle */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Checkbox
                id="simularDesconto"
                checked={formData.simularDesconto}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, simularDesconto: checked === true }))
                }
              />
              <Label htmlFor="simularDesconto" className="cursor-pointer">
                Simular com desconto adicional (5%)
              </Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? 'Calculando...' : 'Calcular Quitação'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {resultado && (
        <Card>
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Resultado do Cálculo</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">Valor para Quitação</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {formatCurrency(resultado.valorQuitacao)}
                </p>
              </div>

              <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                <p className="text-sm text-muted-foreground">Economia Obtida</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {formatCurrency(resultado.economiaObtida)}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-medium text-foreground text-sm">Detalhamento</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor Original do Contrato</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(resultado.detalhes.valorOriginal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Juros Economizados</span>
                  <span className="font-medium text-success">
                    - {formatCurrency(resultado.detalhes.jurosEconomizados)}
                  </span>
                </div>
                {resultado.detalhes.descontoAplicado && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto Adicional (5%)</span>
                    <span className="font-medium text-success">
                      - {formatCurrency(resultado.detalhes.descontoAplicado)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-muted rounded-lg p-4">
              <h3 className="font-medium text-sm mb-3">Parcelas Consideradas</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="text-left">#</th>
                      <th className="text-left">Vencimento</th>
                      <th className="text-right">Valor Original</th>
                      <th className="text-right">Valor Presente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.parcelas.map((p) => (
                      <tr key={p.numero} className="border-t">
                        <td>{p.numero}</td>
                        <td>{p.vencimento}</td>
                        <td className="text-right">
                          {formatCurrency(p.valorOriginal)}
                        </td>
                        <td className="text-right text-primary font-medium">
                          {formatCurrency(p.valorPresente)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Quitacao;
