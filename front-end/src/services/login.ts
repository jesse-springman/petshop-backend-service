const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(name: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Credenciais inválidas");
  }

  const data = await response.json();

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
    const isProd = window.location.protocol === "https:";
    document.cookie = `access_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax${isProd ? "; Secure" : ""}`;
  }

  return data;
}
