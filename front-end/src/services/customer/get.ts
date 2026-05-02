import toast from "react-hot-toast";
import { Client } from "@/types/clients";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getClients(): Promise<Client[]> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const response = await fetch(`${API_URL}/clientes`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
}
