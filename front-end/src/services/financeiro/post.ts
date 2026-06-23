import { Transaction } from "@/types/typeTransaction";
import { getHeaders } from "@/utils/headers";

export type typeOfMovimentation = "ENTRADA" | "SAIDA";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface CreateTransacaoDto {
  type: typeOfMovimentation;
  amount: number;
  category?: string;
  description?: string;
  appointmentsId?: string;
}

export async function createTransacao(dto: CreateTransacaoDto): Promise<Transaction> {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });
  return response.json();
}
