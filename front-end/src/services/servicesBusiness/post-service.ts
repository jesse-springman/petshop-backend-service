import { ServiceType } from "../../types/serviceType";
import { CreateServicePayload } from "@/types/createService";
import { getHeaders } from "@/utils/headers";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createService(payload: CreateServicePayload): Promise<ServiceType> {
  const response = await fetch(`${API_BASE}/services`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? "Erro ao criar serviço");
  }

  return response.json();
}
