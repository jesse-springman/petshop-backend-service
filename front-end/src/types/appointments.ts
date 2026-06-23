import { AppointmentStatus } from "../utils/appointmentsStatus";
import { Pet, Vehicle } from "./clients";

export interface AppointmentCustomer {
  id: string;
  name: string;
  phone: string | null;
}

export interface AppointmentType {
  id: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  petId?: string | null;
  vehicleId?: string | null;
  customer: AppointmentCustomer;
  pet?: Pet | null;
  vehicle?: Vehicle | null;
}
