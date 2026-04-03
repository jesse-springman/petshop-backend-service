import { AppointmentStatus } from "../utils/appointmentsStatus";

export interface AppointmentType {
  id: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  customer: {
    customer_name: string;
    pet_name: string;
    pet_breed: string;
  };
}
