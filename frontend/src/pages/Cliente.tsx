import { useState } from 'react';
import { Search, User, Phone, CreditCard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { consultarCliente, type ClienteResponse } from '@/services/api';

const Cliente = () => {
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ClienteResponse | null>(null);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setResultado(null);

    if (!cpf && !telefone) {
      setErro('Informe pelo menos o CPF ou o telefone.');
      return;
    }

    setLoading(true);

    try {
      const response = await consultarCliente(cpf, telefone);
      setResultado(response);
    } catch (err) {
      // Mock response for development
      const mockResponse: ClienteResponse = {
        nome: 'João da Silva',
        cpf: cpf || '123.456.789-00',
        telefone: telefone || '(11) 99999-9999',
        dataNascimento: '15/03/1980',
        endereco: 'Rua das Flores, 123 - São Paulo/SP',
        margemDisponivel: 850.00,
        situacao: 'Ativo',
      };
      setResultado(mockResponse);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {erro && (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
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
      {resultado && (
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
                  <p className="text-foreground font-medium">{resultado.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {resultado.cpf}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {resultado.telefone}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="text-foreground font-medium">{resultado.dataNascimento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="text-foreground font-medium">{resultado.endereco}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Situação</p>
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    resultado.situacao === 'Ativo' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {resultado.situacao}
                  </span>
                </div>
              </div>
            </div>
            
            {resultado.margemDisponivel !== undefined && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">Margem Disponível</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(resultado.margemDisponivel)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cliente;
