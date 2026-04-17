import { useState } from 'react';
import { Building2, Search, RefreshCw, AlertCircle, CheckCircle, CreditCard, Wallet, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { consultarBanco, type ConsultaBancoResponse } from '@/services/api';
import { formatCPF, validateCPF } from '@/lib/utils';
import { toast } from 'sonner';

const Bancos = () => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ConsultaBancoResponse | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCPF = cpf.replace(/\D/g, '');

    if (!validateCPF(cleanCPF)) {
      setError('CPF inválido. Verifique os dígitos informados.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await consultarBanco(cleanCPF);
      setResultado(response);
    } catch {
      setResultado(null);
      setError('Consulta bancária indisponível no momento.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedField(field);
      toast.success(`${field} copiado!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Erro ao copiar!');
    }
  };

  const InfoField = ({ label, value, icon: Icon, fieldKey, rawValue, colorClass = "text-primary" }: { 
    label: string, 
    value: string, 
    icon: any, 
    fieldKey: string,
    rawValue?: string,
    colorClass?: string
  }) => (
    <div className="group relative bg-card p-5 rounded-2xl border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -mr-10 -mt-10 group-hover:opacity-100 opacity-50 transition-all duration-500 bg-primary/5`} />
      <div className="flex justify-between items-center relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-primary/10 ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
              {label}
            </p>
          </div>
          <p className={`text-xl font-extrabold tracking-tight ${colorClass}`}>
            {value}
          </p>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-xl shadow-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={() => copyToClipboard(rawValue || value, label)}
        >
          {copiedField === label ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-primary" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Consulta Bancária
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Analise margens consignáveis e contratos ativos integrados diretamente com os bancos.
        </p>
      </div>

      {/* Search Form */}
      <Card className="max-w-2xl mx-auto border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">Digite o CPF para Análise</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cpf"
                  className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all text-lg"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive font-medium">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all">
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                  Consultando Instituições...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-3" />
                  Consultar Bancos
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {resultado && (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            <h2 className="text-xl font-bold">Resumo Financeiro</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField 
              label="Margem Disponível" 
              value={formatCurrency(resultado.margemConsignavel)} 
              icon={Wallet} 
              fieldKey="margem"
            />
            <InfoField 
              label="Contratos Ativos" 
              value={String(resultado.contratosAtivos.length)} 
              icon={Building2} 
              fieldKey="contratos"
            />
            <InfoField 
              label="Refinanciamento" 
              value={resultado.possivelRefinanciamento ? "Disponível ✅" : "Indisponível ❌"} 
              icon={ArrowUpRight} 
              fieldKey="refin"
              colorClass={resultado.possivelRefinanciamento ? "text-green-600" : "text-orange-600"}
            />
          </div>

          {/* Table and Ops Container */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-primary/5 py-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Detalhamento de Contratos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border/50">
                        <th className="text-left font-bold py-4 px-6 uppercase tracking-wider text-[10px] text-muted-foreground">Banco</th>
                        <th className="text-left font-bold py-4 px-6 uppercase tracking-wider text-[10px] text-muted-foreground">Parcela</th>
                        <th className="text-left font-bold py-4 px-6 uppercase tracking-wider text-[10px] text-muted-foreground">Restantes</th>
                        <th className="text-left font-bold py-4 px-6 uppercase tracking-wider text-[10px] text-muted-foreground">Saldo Devedor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {resultado.contratosAtivos.map((contrato, index) => (
                        <tr key={index} className="hover:bg-primary/5 transition-colors group">
                          <td className="py-4 px-6 font-bold text-foreground">{contrato.banco}</td>
                          <td className="py-4 px-6 font-medium text-foreground">{formatCurrency(contrato.valorParcela)}</td>
                          <td className="py-4 px-6 text-muted-foreground">{contrato.parcelasRestantes}x</td>
                          <td className="py-4 px-6 font-bold text-primary">{formatCurrency(contrato.valorParcela * contrato.parcelasRestantes)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            {resultado.possivelRefinanciamento && (
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="p-2 rounded-xl bg-green-500/20 text-green-600 shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-green-700 text-lg">Oportunidade de Lucro Identificada</h3>
                  <p className="text-green-800/80 mt-1 leading-relaxed">
                    Este cliente possui contratos elegíveis para refinanciamento com liberação de valores expressivos. A margem disponível de{' '}
                    <span className="font-bold underline">{formatCurrency(resultado.margemConsignavel)}</span> permite uma nova oferta imediata.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bancos;
