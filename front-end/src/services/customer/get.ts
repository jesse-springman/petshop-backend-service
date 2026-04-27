import toast from "react-hot-toast";
import { Client } from "@/types/clients";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getClients(): Promise<Client[]> {
  const response = await fetch(`${API_URL}/clientes`, {
    credentials: "include",
  });

  return response.json();
}
