const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function deleteAppointment(id: string) {
  try {
    const response = await fetch(`${API_URL}/agenda/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-type": "application/json" },
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Falha ao deletar agendamento");
  }
}
