const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface generateMessage {
  customerId: string;
  type: string;
}

export async function postGenerateMessageAI(data: generateMessage) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const response = await fetch(`${API_URL}/ai/generate-message`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error();

  const responseBody = await response.json();
  const messageMadeByIA = responseBody.messageIA.choices[0].message.content;

  return messageMadeByIA;
}
