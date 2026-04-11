import { IsString } from 'class-validator';

export class GetAgendaDto {
  @IsString()
  start!: string;

  @IsString()
  end!: string;
}
