import { getHeaders } from "@/utils/headers";
import { financialSummary } from "@/types/financial-summary";
import { Transaction } from "../../types/typeTransaction";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface TransactionResponse {
  transaction: Transaction[];
  summary: financialSummary;
}

export async function getTransacoes(): Promise<TransactionResponse> {
  const response = await fetch(`${API_BASE}/transactions`, {
    credentials: "include",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }

  return await response.json();
}
