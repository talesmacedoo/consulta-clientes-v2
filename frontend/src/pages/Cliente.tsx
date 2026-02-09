import { useState } from 'react';
import { Search, User, Phone, CreditCard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConsultaClienteResponse, consultarCliente } from '@/services/api';
import { validateCPF, formatCPF, formatPhone, validatePhone} from '@/lib/utils';

const Cliente = () => {
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ConsultaClienteResponse | null>(null);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setResultado(null);

    // Nenhum campo preenchido
    if (!cpf && !telefone) {
      setErro('Informe pelo menos o CPF ou o telefone.');
      return;
    }

    // CPF preenchido, mas inválido
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
      // Envia CPF sem máscara para a API
      const cpfLimpo = cpf.replace(/\D/g, '');

      const response = await consultarCliente(cpfLimpo, telefone);
      setResultado(response);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setResultado({ found: false } as ConsultaClienteResponse);
      } else {
        setErro('Erro ao consultar cliente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Search className="w-6 h-6 text-primary" />
          Consulta Cliente
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Busque informações do cliente por CPF ou telefone.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Dados para Consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhone(e.target.value))}
                  placeholder="(71) 99999-9999"
                />
              </div>
            </div>

            {erro && (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            {resultado && !resultado.found && (
              <Alert variant="destructive">
                <AlertDescription>Cliente não encontrado.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result */}
      {resultado && resultado.found && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="text-foreground font-medium">{resultado.cliente.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {resultado.cliente.cpf}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {resultado.cliente.telefone}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="text-foreground font-medium">
                    {resultado.cliente.data_nascimento}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="text-foreground font-medium">Nada</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cliente;
