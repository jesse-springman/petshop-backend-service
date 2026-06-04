import { Business } from "@/types/business";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getBusiness(): Promise<Business[]> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/superAdmin/business`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar os comercios pendentes");
  }

  return response.json();
}
