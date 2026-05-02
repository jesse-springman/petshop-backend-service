import toast from "react-hot-toast";

export async function deleteCliente(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    toast.error("Erro ao excluir cliente");
  }
  return response.json();
}
