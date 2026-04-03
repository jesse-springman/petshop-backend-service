const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAppointment(start: string, end: string) {
  try {
    const response = await fetch(`${API_URL}/agenda?start=${start}&end=${end}`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Erro em buscar agenda");
  }
}
