import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'João Pedro', description: 'Nome do cliente' })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @ApiProperty({ example: '19992345678', description: 'Telefone do cliente' })
  @IsString({ message: 'O telefone deve ser um texto' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Rua José Aguiar, 345',
    description: 'Endereço do cliente',
  })
  @IsString({ message: 'O endereço deve ser um texto' })
  @IsOptional()
  address?: string;
}
