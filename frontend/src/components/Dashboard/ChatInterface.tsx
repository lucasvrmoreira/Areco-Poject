import { MessageSquare, Loader2, Send } from "lucide-react";


interface ChatInterfaceProps {
  chatLog: { role: string; content: string; sql?: string }[];
  question: string;
  setQuestion: (q: string) => void;
  handleAsk: (e: React.FormEvent) => void;
  loading: boolean;
}

// 1. Lista de Sugestões de Perguntas Rápidas
const SUGESTOES = [
  "Quais os 3 produtos mais vendidos?",
  "Faturamento total por mês?",
  "Qual a participação de cada forma de pagamento?"
];

export default function ChatInterface({ 
  chatLog, 
  question, 
  setQuestion, 
  handleAsk, 
  loading 
}: ChatInterfaceProps) {
  return (
    <aside className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full">
      {/* Cabeçalho */}
      <div className="bg-slate-50 px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-600" />
          <h2 className="font-semibold text-slate-700 text-sm uppercase">Assistente</h2>
        </div>
      </div>

      {/* Histórico de Chat */}
      <div className="grow overflow-y-auto p-4 space-y-4 bg-slate-50/20">
        {chatLog.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* 2. Animação de Carregamento (Bolinhas) */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1 w-fit">
              <span className="text-sm font-medium mr-2">Analisando</span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input de Pergunta e Sugestões */}
      <form onSubmit={handleAsk} className="p-4 bg-white border-t flex flex-col gap-3">
        
        {/* 3. Botões de Sugestão */}
        <div className="flex flex-wrap gap-2">
          {SUGESTOES.map((sugestao, index) => (
            <button
              key={index}
              type="button"
              disabled={loading} // Desabilita o clique se já estiver processando
              onClick={() => setQuestion(sugestao)}
              className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sugestao}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            className="w-full bg-slate-100 border-none rounded-2xl px-4 py-4 pr-12 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"
            placeholder="Pergunte ao Areco IA..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading} // Desabilita o input enquanto carrega
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="absolute right-2 top-2 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </aside>
  );
}