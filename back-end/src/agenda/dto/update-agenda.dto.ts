import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class PatchAgendaDto {
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;
}
