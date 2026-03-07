type RegisterDto = {
  name: string;
  password: string;
  role: "ADMIN" | "USER";
};

export async function registerData(data: RegisterDto) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiBase}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw {
      response: {
        data: responseData,
        status: response.status,
      },
    };
  }
  return responseData;
}
