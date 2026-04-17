import { Bot, Sparkles, Construction, Hammer, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const IA = () => {
  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex items-center justify-center animate-in fade-in duration-700">
      <div className="text-center space-y-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />

        <div className="inline-flex p-6 rounded-3xl bg-primary/10 mb-2 relative group overflow-hidden">
           <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
           <Bot className="w-16 h-16 text-primary relative z-10 animate-bounce" />
        </div>

        <div className="space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Funcionalidade em Desenvolvimento
          </div>
          
          <h1 className="text-5xl font-black tracking-tight text-foreground md:text-6xl">
            IA Estratégica <br />
            <span className="text-primary">Em breve.</span>
          </h1>
          
          <p className="text-muted-foreground max-w-md mx-auto text-lg font-medium leading-relaxed">
            Estamos integrando uma inteligência artificial avançada para gerar roteiros persuasivos e análise de sentimentos em tempo real.
          </p>
        </div>

        <Card className="max-w-md mx-auto border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
              <div className="flex items-center gap-2">
                 <Construction className="w-4 h-4" />
                 Status
              </div>
              <span className="text-primary">85% Concluído</span>
            </div>
            
            <div className="h-3 w-full bg-muted rounded-full p-1 border border-border/50">
               <div className="h-full bg-primary rounded-full animate-pulse transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)]" style={{ width: '85%' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-secondary/30 border border-border/30 flex flex-col items-center gap-2">
                  <Hammer className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase">Construindo</span>
               </div>
               <div className="p-4 rounded-2xl bg-secondary/30 border border-border/30 flex flex-col items-center gap-2">
                  <Rocket className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase">Escalando</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground animate-pulse">
           Fique atento às próximas atualizações do sistema Maktub.
        </p>
      </div>
    </div>
  );
};

export default IA;
