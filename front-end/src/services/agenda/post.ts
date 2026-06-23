interface postData {
  customerId: string;
  date: string;
  notes?: string;
  petId?: string;
  vehicleId?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postAgenda(data: postData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const response = await fetch(`${API_URL}/agenda`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      customerId: data.customerId,
      date: data.date,
      notes: data.notes,
      petId: data.petId,
      vehicleId: data.vehicleId,
    }),
  });

  if (!response.ok) {
    throw new Error("Falha em criar agendamento");
  }

  const responseBody = await response.json();

  return responseBody;
}
