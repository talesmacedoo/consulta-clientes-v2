import { useState } from 'react';
import { Bot, Send, Sparkles, Lightbulb, TrendingUp } from 'lucide-react';
import { analisarIA, type IAAnaliseResponse } from '@/services/api';

const IA = () => {
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<IAAnaliseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!texto.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await analisarIA({ texto });
      setResultado(response);
    } catch {
      setResultado(null);
      setError('Análise de IA indisponível no momento.');
    } finally {
      setLoading(false);
    }
  };

  const exampleTexts = [
    'O cliente disse que está pagando muito caro na parcela atual e quer reduzir o valor mensal.',
    'Aposentado interessado em contratar novo consignado, mas já possui 3 contratos ativos.',
    'Cliente reclamando que o banco atual não oferece boas condições de refinanciamento.',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Bot className="w-7 h-7 text-primary" />
          Assistente IA
        </h1>
        <p className="text-muted-foreground">
          Cole transcrições de conversas para receber sugestões de abordagem inteligente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="card-dashboard space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Transcrição ou Resumo da Conversa
              </label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="input-field min-h-[200px] resize-none"
                placeholder="Cole aqui a transcrição da conversa com o cliente ou descreva o cenário..."
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  Analisando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Analisar com IA
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>

          {/* Results */}
          {resultado && (
            <div className="space-y-6 animate-fade-in">
              {/* Suggested Approach */}
              <div className="card-dashboard">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Abordagem Sugerida
                </h2>
                <p className="text-foreground leading-relaxed">{resultado.abordagemSugerida}</p>
              </div>

              {/* Reasoning */}
              <div className="card-dashboard">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  Raciocínio
                </h2>
                <p className="text-muted-foreground leading-relaxed">{resultado.raciocinio}</p>
              </div>

              {/* Opportunities */}
              <div className="card-dashboard">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Oportunidades Identificadas
                </h2>
                <ul className="space-y-3">
                  {resultado.oportunidades.map((oportunidade, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-foreground">{oportunidade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Examples Sidebar */}
        <div className="lg:col-span-1">
          <div className="card-dashboard">
            <h2 className="text-lg font-semibold text-foreground mb-4">Exemplos de Uso</h2>
            <div className="space-y-3">
              {exampleTexts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setTexto(example)}
                  className="w-full text-left p-3 bg-muted rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"
                >
                  "{example.slice(0, 60)}..."
                </button>
              ))}
            </div>
          </div>

          <div className="card-dashboard mt-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">💡 Dica</h2>
            <p className="text-sm text-muted-foreground">
              Quanto mais detalhes você fornecer sobre a conversa, mais precisa será a sugestão da IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IA;
