import { useState } from 'react';
import { Phone, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatPhone, validatePhone} from '@/lib/utils';

const WhatsApp = () => {
  const [telefone, setTelefone] = useState('');
  const [erro, setErro] = useState('');

  const formatPhoneForWhatsApp = (phone: string): string => {
    // Remove all non-numeric characters
    const numbers = phone.replace(/\D/g, '');
    
    // Add Brazil country code if not present
    if (numbers.length === 10 || numbers.length === 11) {
      return `55${numbers}`;
    }
    
    return numbers;
  };

  /*const validatePhone = (phone: string): boolean => {
    const numbers = phone.replace(/\D/g, '');
    // Valid: 10 digits (landline) or 11 digits (mobile) without country code
    // Or 12-13 digits with country code
    return numbers.length >= 10 && numbers.length <= 13;
  };*/

  const handleSubmit = (e: React.FormEvent) => {
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


    const formattedPhone = formatPhoneForWhatsApp(telefone);
    const whatsappUrl = `https://wa.me/${formattedPhone}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Phone className="w-6 h-6 text-success" />
          WhatsApp
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Abra uma conversa no WhatsApp com o cliente.
        </p>
      </div>

      {/* Form */}
      <Card className="max-w-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Iniciar Ligação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone (com DDD)</Label>
              <Input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(71) 99999-9999"
              />
              <p className="text-xs text-muted-foreground">
                Informe o número com DDD. Ex: (71) 99999-9999
              </p>
            </div>

            {erro && (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-success hover:bg-success/90">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir WhatsApp
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsApp;
