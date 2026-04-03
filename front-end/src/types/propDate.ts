import { AppointmentType } from "./appointments";

export interface PropsDate {
  day: Date;
  appointments: AppointmentType[];
  monthDate?: Date;
  onClick: () => void;
}
