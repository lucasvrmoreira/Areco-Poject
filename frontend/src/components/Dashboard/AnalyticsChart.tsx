// src/components/Dashboard/AnalyticsChart.tsx
import { useState, useEffect } from "react"; // Adicionado useEffect para controle de ciclo de vida
import { DynamicData } from "../../types";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import {
  BarChart3,
  PieChart as PieChartIcon,
  AlertCircle,
  Tag,
} from "lucide-react";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#16a34a",
  "#ca8a04",
];

export default function AnalyticsChart({ data }: { data: DynamicData[] }) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [mounted, setMounted] = useState(false);

  // Hook para garantir que o gráfico só renderize após a montagem no cliente (navegador)
  // Isso evita o erro de "width(-1) and height(-1)" do Recharts no Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data || data.length === 0) return null;

  // Enquanto o componente não estiver montado no navegador, exibe um placeholder
  if (!mounted) {
    return (
      <div className="h-96 w-full bg-slate-50 animate-pulse rounded-2xl border border-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Carregando visualização...</p>
      </div>
    );
  }

  const firstKey = Object.keys(data[0])[0];
  const numericKey = Object.keys(data[0]).find(
    (k) => typeof data[0][k] === "number",
  );

  if (!numericKey) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-slate-500 h-64">
        <AlertCircle size={32} className="mb-2 text-amber-500 opacity-50" />
        <p className="text-sm font-medium">
          Dados insuficientes para gerar gráfico
        </p>
        <p className="text-xs opacity-70 mt-1">
          A consulta atual não retornou valores numéricos comparáveis.
        </p>
      </section>
    );
  }

  const formatValue = (value: any) => {
    if (typeof value !== "number") return value;
    return value > 100
      ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      : value;
  };

  // MODO KPI CARD (Caso a consulta retorne apenas 1 item)
  if (data.length === 1) {
    const nome = data[0][firstKey];
    const valor = data[0][numericKey];

    return (
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Tag size={20} className="text-blue-600" />
          <h2 className="font-bold text-slate-800 text-lg">
            Resultado em Destaque
          </h2>
        </div>
        <div className="h-96 w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100">
          <p className="text-slate-500 font-semibold uppercase tracking-widest mb-4 text-center px-4">
            {nome}
          </p>
          <p className="text-6xl font-black text-blue-600 drop-shadow-sm">
            {formatValue(valor)}
          </p>
          <p className="text-sm text-slate-400 mt-6 uppercase tracking-wider">
            {numericKey.replace("_", " ")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {chartType === "bar" ? (
            <BarChart3 size={20} className="text-blue-600" />
          ) : (
            <PieChartIcon size={20} className="text-blue-600" />
          )}
          <h2 className="font-bold text-slate-800 text-lg">
            Visualização Analítica
          </h2>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setChartType("bar")}
            className={`p-1.5 rounded-md transition-all ${chartType === "bar" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
            title="Gráfico de Barras"
          >
            <BarChart3 size={18} />
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`p-1.5 rounded-md transition-all ${chartType === "pie" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
            title="Gráfico de Pizza"
          >
            <PieChartIcon size={18} />
          </button>
        </div>
      </div>

      <div className="h-96 w-full">
        {/* ResponsiveContainer com minHeight para garantir estabilidade visual */}
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          {chartType === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey={firstKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                dy={10}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                formatter={(val: any) => formatValue(val)}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey={numericKey} radius={[6, 6, 0, 0]} barSize={48}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={4}
                dataKey={numericKey}
                nameKey={firstKey}
                label={({
                  name,
                  percent,
                }: {
                  name?: string;
                  percent?: number;
                }) =>
                  `${name || "Item"} (${((percent || 0) * 100).toFixed(0)}%)`
                }
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => formatValue(val)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}