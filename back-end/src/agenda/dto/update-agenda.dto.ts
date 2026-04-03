import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class PatchAgendaDTO {
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;
}
