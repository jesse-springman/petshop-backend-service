import { BusinessDto } from "@/types/businessDto";

export async function registerBusiness(dto: BusinessDto) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  console.log("apiBase:", apiBase);
  console.log("url completa:", `${apiBase}/Onboarding`);
  console.log("dto:", dto);

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
