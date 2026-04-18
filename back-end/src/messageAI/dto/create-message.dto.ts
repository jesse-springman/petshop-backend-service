import { IsEnum, IsString } from 'class-validator';

export enum TypeMessage {
  LEMBRETE_BANHO = 'LEMBRETE_BANHO',
  AGENDAMENTO = 'AGENDAMENTO',
  COBRANCA = 'COBRANCA',
}

export class GenerarteMessageDto {
  @IsString()
  customerId!: string;

  @IsEnum(TypeMessage)
  type!: TypeMessage;
}
