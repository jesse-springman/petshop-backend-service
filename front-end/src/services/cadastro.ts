export async function createCustomer(customer_name: string, pet_name: string) {
  if (!customer_name) {
    throw new Error("Campo 'Nome do Cliente' deve ser preenchido");
  }

  if (!pet_name) {
    throw new Error("Campo 'Nome do Pet' deve ser preenchido");
  }

  const response = await fetch('/cadastro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name,
      pet_name,
    }),
  });

  return response.json();
}
