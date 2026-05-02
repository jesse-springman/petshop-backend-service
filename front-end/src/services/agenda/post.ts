interface postData {
  customerId: string;
  date: string;
  notes?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postAgenda(data: postData) {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/agenda`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        customerId: data.customerId,
        date: data.date,
        notes: data.notes,
      }),
    });

    const responseBody = await response.json();

    return responseBody;
  } catch (error) {
    console.log(error);
    throw new Error("Falha em criar agendamento");
  }
}
