import { Plan } from "@/types/plan";

type dtoPetshop = {
  petshopName: string;
  adiminName: string;
  password: string;
  plan: Plan;
  whatsapp: string;
};

export async function registerPetshop(dto: dtoPetshop) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiBase}/Onboarding`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error("Erro ao registrar. Tente novamente.");
  }

  return response.json();
}
