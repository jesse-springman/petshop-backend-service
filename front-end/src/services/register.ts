type RegisterDto = {
  name: string;
  password: string;
  role: "ADMIN" | "USER";
};

export async function registerData(data: RegisterDto) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const token = localStorage.getItem("access_token");

  const response = await fetch(`${apiBase}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao cadastrar usuário");
  }

  return await response.json();
}
