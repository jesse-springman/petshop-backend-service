import { IsOptional, IsString } from 'class-validator';

export class CreateAgendaDto {
  @IsString()
  customerId!: string;

  @IsString()
  date!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
