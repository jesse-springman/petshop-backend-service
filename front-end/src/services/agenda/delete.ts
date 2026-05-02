const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function deleteAppointment(id: string) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`${API_URL}/agenda/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-type": "application/json", Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Falha ao deletar agendamento");
  }
}
