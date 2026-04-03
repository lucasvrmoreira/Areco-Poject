// src/services/api.ts
import { QueryResponse } from "../types";

const API_URL = "http://localhost:8000";

export const apiService = {
  async askQuestion(question: string): Promise<QueryResponse> {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error("Erro na consulta ao servidor Areco DataIntel");
    }

    return await response.json();
  }
};