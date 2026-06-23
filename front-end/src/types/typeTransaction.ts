export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  category?: string;
  createdAt: string;
}
