import { AppointmentType } from "../../../types/appointments";

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, "0");

export const mockAppointment: AppointmentType = {
  id: "appointment-uuid-1",
  date: `${currentYear}-${currentMonth}-15T10:00:00`,
  status: "SCHEDULED",
  notes: "Banho e Tosa",
  petId: "pet-uuid-1",
  vehicleId: null,
  customer: {
    id: "uuid-1",
    name: "João Silva",
    phone: "19983350238",
  },
  pet: {
    id: "pet-uuid-1",
    name: "Rex",
    breed: "Labrador",
    lastBath: null,
    customerId: "uuid-1",
    createdAt: `${currentYear}-${currentMonth}-01T08:00:00`,
  },
  vehicle: null,
};

export const mockAppointmentAutomotive: AppointmentType = {
  id: "appointment-uuid-2",
  date: `${currentYear}-${currentMonth}-15T14:00:00`,
  status: "SCHEDULED",
  notes: "Higienização Completa",
  petId: null,
  vehicleId: "vehicle-uuid-1",
  customer: {
    id: "uuid-2",
    name: "Carlos Souza",
    phone: "19987654321",
  },
  pet: null,
  vehicle: {
    id: "vehicle-uuid-1",
    brand: "Toyota",
    model: "Corolla",
    plate: "ABC-1234",
    customerId: "uuid-2",
    createdAt: `${currentYear}-${currentMonth}-01T08:00:00`,
  },
};

export const mockAppointmentFeminine: AppointmentType = {
  id: "appointment-uuid-3",
  date: `${currentYear}-${currentMonth}-15T16:00:00`,
  status: "SCHEDULED",
  notes: "Alongamento de Cílios",
  petId: null,
  vehicleId: null,
  customer: {
    id: "uuid-3",
    name: "Ana Lima",
    phone: "19991234567",
  },
  pet: null,
  vehicle: null,
};
