import { useState } from 'react';
import { Phone, ExternalLink, ShieldCheck, Zap, Copy, Check, Headset, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatPhone, validatePhone} from '@/lib/utils';
import { toast } from 'sonner';
import { verificarRestricoes } from '@/services/api';

const WhatsApp = () => {
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatPhoneForWhatsApp = (phone: string): string => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 10 || numbers.length === 11) {
      return `55${numbers}`;
    }
    return numbers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!telefone) {
      setErro('Informe o número de telefone.');
      return;
    }

    if (!validatePhone(telefone)) {
      setErro('Número de telefone inválido. Informe o DDD + número.');
      return;
    }
    
    setLoading(true);

    try {
      const resp = await verificarRestricoes(telefone.replace(/\D/g, ''));
      
      if (resp.bloqueado) {
        setErro('Cliente na blacklist da empresa. Não é possível iniciar atendimento.');
        setLoading(false);
        return;
      }
      
      if (resp.aviso === 'sem_interesse') {
        toast.warning('Atenção: Cliente relatou não ter interesse recentemente.', { duration: 5000 });
      }

      const formattedPhone = formatPhoneForWhatsApp(telefone);
      const whatsappUrl = `https://wa.me/${formattedPhone}`;
      
      toast.success('Direcionando para o WhatsApp...');
      window.open(whatsappUrl, '_blank');
      
    } catch(err) {
      setErro('Erro ao verificar restrições. Tente novamente mais tarde.');
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

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500 py-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-green-500/10 mb-2 relative">
           <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full animate-pulse" />
           <Headset className="w-10 h-10 text-green-600 relative z-10" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Ligação WhatsApp
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto font-medium">
          Direcione seu atendimento para uma chamada de voz estratégica via WhatsApp.
        </p>
      </div>

      {/* Form Card */}
      <Card className="border-none shadow-2xl bg-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/10 transition-all duration-700" />
        <CardHeader className="pt-10 pb-4">
          <CardTitle className="text-lg font-bold text-center flex items-center justify-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
             Pronto para Iniciar
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-10 px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="telefone" className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground text-center block">Número do Cliente</Label>
              <div className="relative group/input flex items-center">
                <Phone className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within/input:text-green-600 transition-colors" />
                <Input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  className="pl-12 h-16 bg-secondary/20 border-border/50 text-2xl font-black rounded-2xl focus:border-green-500/50 focus:ring-green-500/20 transition-all text-center"
                  placeholder="(00) 00000-0000"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 opacity-0 group-hover/input:opacity-100 transition-opacity rounded-xl"
                  onClick={() => copyToClipboard(telefone, 'Telefone')}
                >
                  {copiedField === 'Telefone' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {erro && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-xl">
                <AlertDescription className="font-semibold text-center">{erro}</AlertDescription>
              </Alert>
            )}

            <Button disabled={loading} type="submit" className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black text-xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl">
              {loading ? (
                 <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              ) : (
                <ExternalLink className="w-6 h-6 mr-3" />
              )}
              {loading ? "Verificando..." : "Realizar Ligação"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
          <p className="text-xs text-muted-foreground font-medium bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
             O WhatsApp será aberto em uma nova aba para iniciar o contato de voz.
          </p>
      </div>
    </div>
  );
};

export default WhatsApp;
