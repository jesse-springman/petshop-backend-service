import { BusinessStatus } from "@/types/statusBusiness";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function patchBusiness(id: string, status: BusinessStatus) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/superAdmin/business/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Erro ao atualizar status");
  return response.json();
}
