import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class CreateAgendaDto {
  @ApiProperty({
    example: 'uuid-do-cliente',
    description: 'ID do cliente',
  })
  @IsUUID()
  customerId!: string;

  @ApiProperty({
    example: '2026-04-11T14:00:00Z',
    description: 'Data e hora do agendamento',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    example: 'Tipo de serviço a ser realizado',
    description: 'Observações do agendamento',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
