import { getHeaders } from "@/utils/headers";
import { ServiceType } from "@/types/serviceType";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getServices(): Promise<ServiceType[]> {
  const response = await fetch(`${API_BASE}/services`, {
    credentials: "include",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar serviços");
  }

  return response.json();
}
