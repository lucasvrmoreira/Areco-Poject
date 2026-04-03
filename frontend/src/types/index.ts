// src/types/index.ts
export type DynamicData = Record<string, string | number>;



export interface Venda {
  id: number;
  data: string;
  produto: string;
  valor_unidade: number;
  quantidade: number;
  total: number;
  forma_pagamento: string;
  parcelado: string;
}

export interface QueryResponse {
  sql_generated: string;
  data: DynamicData[]; 
  human_response: string;
}