import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function getClients() {
  const response = await fetch(`${API_URL}/clientes`, {
    credentials: "include",
  });

  if (!response.ok) {
    toast.error("Não foi possível localizar os clientes.");
  }

  return response.json();
}
