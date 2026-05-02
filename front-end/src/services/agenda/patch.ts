const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { AppointmentStatus } from "../../utils/appointmentsStatus";

export async function patchAppointments(idAppointment: string, status: AppointmentStatus) {
  try {
    const token = localStorage.getItem("acess_token");
    const response = await fetch(`${API_URL}/agenda/${idAppointment}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: status }),
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Erro na atualização do agendamento");
  }
}
