import { Transaction } from "@/types/typeTransaction";
import { getHeaders } from "@/utils/headers";
import { CreateTransactionDto } from "@/types/createTransaction";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createTransacao(dto: CreateTransactionDto): Promise<Transaction> {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(dto),
  });
  return response.json();
}
