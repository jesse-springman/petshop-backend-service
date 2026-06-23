import { getHeaders } from "@/utils/headers";
import { financialSummary } from "@/types/financial-summary";
import { Transaction } from "../../types/typeTransaction";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

interface TransactionsResponse {
  transaction: Transaction[];
  summary: financialSummary;
}

export async function getTransacoes(): Promise<TransactionsResponse> {
  const response = await fetch(`${API_BASE}/transactions`, {
    credentials: "include",
    headers: getHeaders(),
  });
  const data = await response.json();
  console.log("resposta da API:", data);
  return data;
}

export function calcularResumoDoMes(transacoes: Transaction): financialSummary {
  const agora = new Date();
  const doMes = transacoes.filter((t) => {
    const d = new Date(t.createdAt);
    return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
  });

  const revenue = doMes
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expenses = doMes
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  return {
    revenue,
    expenses,
    profit: revenue - expenses,
    totalTransactions: doMes.length,
  };
}
