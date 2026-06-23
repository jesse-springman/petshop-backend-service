type cadastroDto = {
  name: string;
  phone: string;
  address: string;
};

export async function cadastroData(data: cadastroDto) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const response = await fetch(`${apiBase}/cadastro`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar cliente");
  }
  return response.json();
}
