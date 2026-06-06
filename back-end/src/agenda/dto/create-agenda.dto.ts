import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateAgendaDto {
  @ApiProperty({
    example: '2026-06-10T14:00:00.000Z',
    description: 'Data e hora do agendamento',
  })
  @IsISO8601({}, { message: 'A data deve estar em formato ISO8601 válido' })
  date!: string;

  @ApiProperty({ example: 'uuid-do-cliente', description: 'ID do cliente' })
  @IsString()
  @IsNotEmpty({ message: 'O customerId é obrigatório' })
  customerId!: string;

  @ApiProperty({
    example: 'uuid-do-pet',
    description: 'ID do pet (somente petshop)',
    required: false,
  })
  @IsString()
  @IsOptional()
  petId?: string;

  @ApiProperty({
    example: 'uuid-do-veiculo',
    description: 'ID do veículo (somente automotivo)',
    required: false,
  })
  @IsString()
  @IsOptional()
  vehicleId?: string;

  @ApiProperty({
    example: 'Banho e tosa',
    description: 'Observações do agendamento',
    required: false,
  })
  @IsString({ message: 'As observações devem ser um texto' })
  @IsOptional()
  notes?: string;
}
