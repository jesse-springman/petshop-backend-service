const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAppointment(start: string, end: string) {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/agenda?start=${start}&end=${end}`, {
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    console.log("data:", data);

    return Array.isArray(data) ? data : (data.appointment ?? []);
  } catch (error) {
    console.log(error);
    throw new Error("Erro em buscar agenda");
  }
}
