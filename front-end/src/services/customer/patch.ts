import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type UpdateClientDTO = {
  customer_name: string;
  pet_name: string;
  address: string;
  number_customer: string;
  pet_breed: string;
  last_bath: string;
};

export async function patchClientList(id: string, data: UpdateClientDTO) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.error("Erro na Atualização de dados");
  }

  return response.json();
}
