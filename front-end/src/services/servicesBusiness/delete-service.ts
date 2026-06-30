import { getHeaders } from "@/utils/headers";

export async function deleteService(id: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_BASE}/services/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error("Erro ao remover serviço");
}
