export type typeOfMovimentation = "INCOME" | "EXPENSE";

export interface CreateTransactionDto {
  type: typeOfMovimentation;
  amount: number;
  category?: string;
  description?: string;
  appointmentsId?: string;
}
