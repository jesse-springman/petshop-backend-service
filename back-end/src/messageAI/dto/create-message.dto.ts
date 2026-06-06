import { IsEnum, IsString, IsOptional } from 'class-validator';
import { Commerce } from '@prisma/client';

export enum TypeMessage {
  LEMBRETE_BANHO = 'LEMBRETE_BANHO',
  AGENDAMENTO = 'AGENDAMENTO',
  COBRANCA = 'COBRANCA',

  LEMBRETE_REVISAO = 'LEMBRETE_REVISAO',
  VEICULO_PRONTO = 'VEICULO_PRONTO',

  LEMBRETE_PROCEDIMENTO = 'LEMBRETE_PROCEDIMENTO',
  RETORNO = 'RETORNO',
}

export class GenerateMessageDto {
  @IsString()
  customerId!: string;

  @IsEnum(TypeMessage)
  type!: TypeMessage;

  @IsEnum(Commerce)
  commerce!: Commerce;

  @IsString()
  @IsOptional()
  petId?: string;

  @IsString()
  @IsOptional()
  vehicleId?: string;
}
