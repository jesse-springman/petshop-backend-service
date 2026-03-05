type cadastroDto = {
  customer_name: string;
  pet_name: string;
  pet_breed: string;
  number_customer: string;
  last_bath: Date;
  address: string;
};

export async function cadastroData(data: cadastroDto) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiBase}/cadastro`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar cliente");
  }
  return response.json();
}
