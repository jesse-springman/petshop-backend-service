const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { AppointmentStatus } from "../../utils/appointmentsStatus";

export async function patchAppointments(idAppointment: string, status: AppointmentStatus) {
  try {
    const response = await fetch(`${API_URL}/agenda/${idAppointment}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    });

    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Erro na atualização do agendamento");
  }
}
