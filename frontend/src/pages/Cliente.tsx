import { useState } from 'react';
import { Search, User, Phone, CreditCard, Loader2, Copy, Check, Calendar, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConsultaClienteResponse, consultarCliente } from '@/services/api';
import { validateCPF, formatCPF, formatPhone, validatePhone, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const Cliente = () => {
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ConsultaClienteResponse | null>(null);
  const [erro, setErro] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setResultado(null);

    if (!cpf && !telefone) {
      setErro('Informe pelo menos o CPF ou o telefone.');
      return;
    }

    if (cpf && !validateCPF(cpf)) {
      setErro('CPF inválido.');
      return;
    }

    if (telefone && !validatePhone(telefone)) {
      setErro('Telefone inválido.');
      return;
    }

    setLoading(true);

    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      const response = await consultarCliente(cpfLimpo, telefone);
      setResultado(response);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setResultado({ found: false } as ConsultaClienteResponse);
      } else if (err.response?.status === 403) {
        setErro(err.response?.data?.message || 'Cliente listado na Blacklist.');
        setResultado({ found: false } as ConsultaClienteResponse);
      } else {
        setErro('Erro ao consultar cliente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    if (!text) return;
    
    try {
      // Tenta usar a Clipboard API moderna
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: método tradicional para contextos não seguros ou navegadores antigos
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!successful) throw new Error('Falha no execCommand');
      }
      
      setCopiedField(field);
      toast.success(`${field} copiado!`, {
        description: `O valor "${text}" está pronto para ser colado.`,
        duration: 2000,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      toast.error('Não foi possível copiar o texto.');
    }
  };

  const InfoField = ({ label, value, icon: Icon, fieldKey, rawValue }: { 
    label: string, 
    value: string, 
    icon: any, 
    fieldKey: string,
    rawValue?: string 
  }) => (
    <div className="group relative bg-card p-5 rounded-2xl border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-500 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
              {label}
            </p>
          </div>
          <p className="text-lg font-extrabold text-foreground tracking-tight line-clamp-1">
            {value}
          </p>
        </div>
        
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-xl shadow-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95"
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2">
          <Search className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Consulta Avançada
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Encontre informações detalhadas de clientes integradas com nossa base de dados.
        </p>
      </div>

      {/* Search Form */}
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium">CPF do Cliente</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="cpf"
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium">Telefone / Celular</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="telefone"
                    type="tel"
                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-all"
                    value={telefone}
                    onChange={(e) => setTelefone(formatPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {erro && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            {resultado && !resultado.found && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertDescription className="font-semibold">⚠️ Nenhum registro encontrado para este critério.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Buscando dados...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-3" />
                  Iniciar Consulta
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result Section */}
      {resultado && resultado.found && (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
          
          {resultado.sem_interesse && (
            <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500">
              <AlertDescription className="font-bold flex items-center gap-2">
                ⚠️ {resultado.message || 'Atenção: cliente relatou não ter interesse recentemente.'}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-3 px-2">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            <h2 className="text-xl font-bold">Resultado Encontrado</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <InfoField 
                label="Nome Completo" 
                value={resultado.cliente.nome} 
                icon={User} 
                fieldKey="nome"
              />
            </div>
            <InfoField 
              label="CPF" 
              value={formatCPF(resultado.cliente.cpf)} 
              icon={CreditCard} 
              fieldKey="cpf"
              rawValue={resultado.cliente.cpf}
            />
            <InfoField 
              label="Telefone Principal" 
              value={formatPhone(resultado.cliente.telefone)} 
              icon={Phone} 
              fieldKey="telefone"
              rawValue={resultado.cliente.telefone}
            />
            <InfoField 
              label="Data de Nascimento" 
              value={formatDate(resultado.cliente.data_nascimento)} 
              icon={Calendar} 
              fieldKey="nascimento"
            />
            <InfoField 
              label="Data de Atualização" 
              value={formatDate(resultado.cliente.data_consulta)} 
              icon={RefreshCw} 
              fieldKey="atualizacao"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cliente;
