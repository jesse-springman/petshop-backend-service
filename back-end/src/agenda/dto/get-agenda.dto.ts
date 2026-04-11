import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetAgendaDto {
  @ApiProperty({
    example: '01/02/26',
    description: 'Inicio do mês para conferir a agenda',
  })
  @IsString()
  start!: string;

  @ApiProperty({
    example: '01/02/26',
    description: 'Fim do mês para conferir a agenda',
  })
  @IsString()
  end!: string;
}
