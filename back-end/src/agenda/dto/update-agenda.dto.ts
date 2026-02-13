import { AppointmentStatus } from '@prisma/client';

export class PatchAgendaDTO {
  status!: AppointmentStatus;
}
