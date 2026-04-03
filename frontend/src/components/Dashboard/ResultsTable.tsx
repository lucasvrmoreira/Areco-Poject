// src/components/Dashboard/ResultsTable.tsx
import { Table as TableIcon } from "lucide-react";

export default function ResultsTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <TableIcon size={20} className="text-blue-600" />
        <h2 className="font-bold text-slate-800 text-lg">Dados da Consulta</h2>
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200 z-10">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-6 py-4 font-bold uppercase tracking-wider"
                >
                  {key.replace("_", " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition">
                {Object.values(row).map((val: any, j) => (
                  <td
                    key={j}
                    className="px-6 py-4 text-slate-600 font-medium text-xs"
                  >
                    {(() => {
                      // 1. Se for um número grande, formata como Real
                      if (typeof val === "number" && val > 100) {
                        return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
                      }

                      // 2. Se for uma data no formato YYYY-MM, vamos inverter para MM/YYYY
                      if (
                        typeof val === "string" &&
                        /^\d{4}-\d{2}$/.test(val)
                      ) {
                        const [ano, mes] = val.split("-");
                        return `${mes}/${ano}`;
                      }

                      // 3. Caso contrário, apenas exibe o valor original
                      return val;
                    })()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
