import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'João Pedro',
    description: 'Nome do dono do pet',
  })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do dono é obrigátorio' })
  customer_name!: string;

  @ApiProperty({
    example: 'Rex',
    description: 'Nome do pet',
  })
  @IsString({ message: 'O nome do pet deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do Pet é obrigatório' })
  pet_name!: string;

  @ApiProperty({
    example: 'Rua José Aguiar n345',
    description: 'Endereço do tutor',
  })
  @IsString({ message: 'O endereço deve ser um texto' })
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  address!: string;

  @ApiProperty({
    example: '19992345678',
    description: 'Número do tutor',
  })
  @IsString({ message: 'O telefone deve ser texto' })
  @IsNotEmpty({ message: 'o número é obrigatório' })
  number_customer!: string;

  @ApiProperty({
    example: 'PitBull',
    description: 'Nome da raça do pet',
  })
  @IsOptional()
  @IsString({ message: 'A raça deve ser um texto' })
  pet_breed?: string;

  @ApiProperty({
    example: '22/03/26',
    description: 'Data do último banho(Opcional) ',
  })
  @IsOptional()
  @IsISO8601({}, { message: 'A data deve estar no formato de data válido' })
  last_bath?: string;
}
