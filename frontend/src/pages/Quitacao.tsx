import { useState } from 'react';
import { Calculator, Download, Percent, TrendingDown, Banknote, ChevronDown, ChevronUp, Loader2, Calendar, Target, PiggyBank, Receipt, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calcularQuitacao, type QuitacaoRequest, type QuitacaoResponse } from '@/services/api';
import { exportarPNG } from '@/utils/exportarPNG';
import { toast } from 'sonner';

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
      toast.success('Cálculo finalizado com sucesso!');
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
      toast.success('Imagem gerada e baixada!');
    } catch {
      setError('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  const pctPago = resultado
    ? (resultado.economiaObtida / resultado.totalNominal) * 100
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Calculadora de Quitação
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Calcule a economia real ao antecipar parcelas de empréstimos e financiamentos.
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assinatura</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    name="dataAssinatura"
                    className="pl-10 h-11 bg-background/50"
                    value={formData.dataAssinatura}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Valor Parcela</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    name="valorParcela"
                    className="pl-10 h-11 bg-background/50"
                    value={formData.valorParcela || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Juros Mensal (%)</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    name="jurosMensal"
                    className="pl-10 h-11 bg-background/50"
                    value={formData.jurosMensal || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vencimento (Dia)</Label>
                <Input
                  type="number"
                  name="diaVencimento"
                  className="h-11 bg-background/50"
                  value={formData.diaVencimento || ''}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Parcelas</Label>
                <Input
                  type="number"
                  name="totalParcelas"
                  className="h-11 bg-background/50"
                  value={formData.totalParcelas || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data Quitação</Label>
                <Input
                  type="date"
                  name="dataQuitacao"
                  className="h-11 bg-background/50 border-primary/30"
                  value={formData.dataQuitacao}
                  onChange={handleInputChange}
                  required
                />
              </div>

            </div>

            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive font-medium">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Calculando Projeções...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-3" />
                  Gerar Cálculo de Quitação
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {resultado && (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700 pb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-primary rounded-full" />
              <h2 className="text-xl font-bold">Projeção de Economia</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-xl bg-background/50 border-border/50 shadow-sm"
              onClick={handleExportPDF}
              disabled={exporting}
            >
              {exporting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando Arquivo...</>
                : <><Download className="w-4 h-4 mr-2" />Exportar PNG para Cliente</>
              }
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Destaque Principal */}
            <Card className="lg:col-span-1 border-none shadow-2xl bg-primary shadow-primary/20 text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
              <CardContent className="pt-8 pb-10 space-y-4">
                <div className="p-2 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-primary-foreground/70 font-bold uppercase tracking-widest text-[10px]">Total para Quitação</p>
                  <p className="text-4xl font-black mt-2">
                    {formatCurrency(resultado.valorQuitacao)}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-70" />
                  <p className="text-xs opacity-80 font-medium">Cálculo base: {formData.dataQuitacao.split('-').reverse().join('/')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Grid de Métricas */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm flex items-center gap-4 group hover:border-green-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Juros Economizados</p>
                  <p className="text-2xl font-black text-green-600">{formatCurrency(resultado.economiaObtida)}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Sem Desconto</p>
                  <p className="text-2xl font-black text-foreground">{formatCurrency(resultado.totalNominal)}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm flex items-center gap-4 group hover:border-orange-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Percent className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Margem de Desconto</p>
                  <p className="text-2xl font-black text-orange-600">{resultado.percentualEconomizado}%</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-sm flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PiggyBank className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Economia por Parcela</p>
                  <p className="text-2xl font-black text-blue-600">{formatCurrency(resultado.descontoMedioParcela)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Progresso de Economia */}
          <div className="bg-card/50 p-6 rounded-2xl border border-border/40">
            <div className="flex justify-between items-center mb-4">
               <div>
                 <h3 className="font-bold text-foreground">Distribuição do Valor</h3>
                 <p className="text-xs text-muted-foreground">Comparativo entre custo total e economia gerada.</p>
               </div>
               <span className="text-2xl font-black text-primary">{Math.round(pctPago)}% Economizado</span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden border border-border/50 p-1">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                style={{ width: `${Math.min(pctPago, 100)}%` }}
              />
            </div>
          </div>

          {/* Detalhamento por Parcela */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setTabelaAberta((v) => !v)}
              className="w-full flex items-center justify-between p-6 bg-secondary/30 hover:bg-secondary/50 rounded-2xl border border-border/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-background shadow-sm">
                  <Banknote className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Listagem Detalhada de Parcelas</p>
                  <p className="text-xs text-muted-foreground">Confira o valor presente de cada uma das {resultado.parcelas.length} parcelas.</p>
                </div>
              </div>
              {tabelaAberta ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>

            {tabelaAberta && (
              <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md animate-in slide-in-from-top-4 duration-500">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/50">
                      <th className="py-4 px-6 text-left font-bold uppercase text-[10px] text-muted-foreground">Parcela</th>
                      <th className="py-4 px-6 text-left font-bold uppercase text-[10px] text-muted-foreground">Vencimento</th>
                      <th className="py-4 px-6 text-right font-bold uppercase text-[10px] text-muted-foreground">Valor Brutlo</th>
                      <th className="py-4 px-6 text-right font-bold uppercase text-[10px] text-muted-foreground">Valor c/ Desconto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {resultado.parcelas.map((p) => (
                      <tr key={p.numero} className="hover:bg-primary/5 transition-colors">
                        <td className="py-4 px-6 font-bold">{p.numero}</td>
                        <td className="py-4 px-6 text-muted-foreground">{p.vencimento}</td>
                        <td className="py-4 px-6 text-right text-muted-foreground">{formatCurrency(p.valorOriginal)}</td>
                        <td className="py-4 px-6 text-right font-black text-primary">
                          {formatCurrency(p.valorPresente)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quitacao;
