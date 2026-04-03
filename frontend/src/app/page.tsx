"use client";

import { useState } from "react";
import { BarChart3, AlertCircle } from "lucide-react";
import ChatInterface from "../components/Dashboard/ChatInterface";
import ResultsTable from "../components/Dashboard/ResultsTable";
import AnalyticsChart from "../components/Dashboard/AnalyticsChart";

// Importamos o serviço e os tipos refinados
import { apiService } from "../services/api";
import { QueryResponse, DynamicData } from "../types";

export default function Home() {
  const [question, setQuestion] = useState("");
  
  // Tipagem do log do chat para garantir consistência nas mensagens
  const [chatLog, setChatLog] = useState<
    { role: string; content: string; sql?: string }[]
  >([]);
  
  // data como 'null' indica que nenhuma busca foi feita ainda (Estado Inicial)
  const [data, setData] = useState<DynamicData[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userQuestion = question;
    setQuestion("");
    setLoading(true);

    // Adiciona a pergunta do usuário ao chat
    setChatLog((prev) => [...prev, { role: "user", content: userQuestion }]);

    try {
      // Chamada ao serviço centralizado
      const result: QueryResponse = await apiService.askQuestion(userQuestion);

      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.human_response, 
          sql: result.sql_generated, 
        },
      ]);

      setData(result.data);
    } catch (error: any) {
      // Captura o erro e exibe a mensagem amigável retornada pelo backend
      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "Desculpe, ocorreu um erro ao conectar com o Areco IA.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6 animate-in fade-in duration-500">
      <ChatInterface
        chatLog={chatLog}
        question={question}
        setQuestion={setQuestion}
        handleAsk={handleAsk}
        loading={loading}
      />

      <main className="grow overflow-y-auto space-y-6 pr-2">
        {/* LÓGICA DE ESTADOS DA DASHBOARD */}
        {data === null ? (
          // 1. ESTADO INICIAL: Quando o usuário ainda não fez perguntas
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <BarChart3 size={48} className="mb-4 opacity-20" />
            <p className="font-medium">O que vamos analisar hoje?</p>
            <p className="text-sm opacity-60">Selecione uma sugestão ou digite sua pergunta.</p>
          </div>
        ) : data.length > 0 ? (
          // 2. ESTADO DE SUCESSO: Quando há dados para exibir
          <>
            <ResultsTable data={data} />
            <AnalyticsChart data={data} />
          </>
        ) : (
          // 3. ESTADO VAZIO: Quando a busca foi feita, mas não retornou registros
          <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            <AlertCircle size={40} className="mb-3 text-amber-500 opacity-50" />
            <p className="font-medium text-slate-600">Nenhum registro encontrado</p>
            <p className="text-sm opacity-60 px-8 text-center">
              A consulta foi realizada com sucesso, mas não existem dados que correspondam aos critérios solicitados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}