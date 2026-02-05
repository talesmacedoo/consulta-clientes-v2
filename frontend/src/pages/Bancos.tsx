import { useState } from 'react';
import { Building2, Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { consultarBanco, type ConsultaBancoResponse } from '@/services/api';

const Bancos = () => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ConsultaBancoResponse | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
      setError('CPF inválido. Digite os 11 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await consultarBanco(cleanCPF);
      setResultado(response);
    } catch (err) {
      setError('Erro na consulta. Tente novamente.');
      // Mock response for demo
      setResultado({
        margemConsignavel: 850.0,
        contratosAtivos: [
          { banco: 'Banco do Brasil', valorParcela: 320.0, parcelasRestantes: 24 },
          { banco: 'Caixa Econômica', valorParcela: 180.0, parcelasRestantes: 12 },
        ],
        possivelRefinanciamento: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Building2 className="w-7 h-7 text-primary" />
          Consulta Bancária
        </h1>
        <p className="text-muted-foreground">
          Consulte margens consignáveis e contratos ativos por CPF.
        </p>
      </div>

      {/* Search Form */}
      <div className="card-dashboard max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CPF do Cliente
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={cpf}
                onChange={handleCPFChange}
                className="input-field flex-1"
                placeholder="000.000.000-00"
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Consultar
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      {resultado && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card">
              <p className="stat-label">Margem Consignável Disponível</p>
              <p className="stat-value text-primary mt-1">
                {formatCurrency(resultado.margemConsignavel)}
              </p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Contratos Ativos</p>
              <p className="stat-value mt-1">{resultado.contratosAtivos.length}</p>
            </div>

            <div className="stat-card">
              <p className="stat-label">Possível Refinanciamento</p>
              <div className="mt-2">
                {resultado.possivelRefinanciamento ? (
                  <span className="badge badge-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Sim
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Não
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Active Contracts Table */}
          <div className="card-dashboard">
            <h2 className="text-lg font-semibold text-foreground mb-4">Contratos Ativos</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Banco
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Valor da Parcela
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Parcelas Restantes
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Saldo Devedor (Estimado)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.contratosAtivos.map((contrato, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {contrato.banco}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatCurrency(contrato.valorParcela)}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {contrato.parcelasRestantes}x
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatCurrency(contrato.valorParcela * contrato.parcelasRestantes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation */}
          {resultado.possivelRefinanciamento && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h3 className="font-semibold text-success flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Oportunidade Identificada
              </h3>
              <p className="text-sm text-foreground mt-2">
                Este cliente possui contratos elegíveis para refinanciamento. A margem disponível de{' '}
                <strong>{formatCurrency(resultado.margemConsignavel)}</strong> permite novas operações.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bancos;
