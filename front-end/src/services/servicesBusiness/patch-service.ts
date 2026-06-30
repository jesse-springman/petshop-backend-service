import { UpdateServicePayLoad } from "@/types/updateService";
import { ServiceType } from "@/types/serviceType";
import { getHeaders } from "@/utils/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function updateService(
  id: string,
  payload: UpdateServicePayLoad,
): Promise<ServiceType> {
  const response = await fetch(`${API_BASE}/services/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Erro ao atualizar serviço");
  return response.json();
}
