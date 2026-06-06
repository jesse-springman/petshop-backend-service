import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({ example: 'Rex', description: 'Nome do pet' })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do pet é obrigatório' })
  name!: string;

  @ApiProperty({ example: 'Pitbull', description: 'Raça do pet' })
  @IsString({ message: 'A raça deve ser um texto' })
  @IsOptional()
  breed?: string;

  @ApiProperty({
    example: 'uuid-do-cliente',
    description: 'ID do cliente dono do pet',
  })
  @IsString()
  @IsNotEmpty({ message: 'O customerId é obrigatório' })
  customerId!: string;

  @ApiProperty({
    example: '2026-03-22T00:00:00.000Z',
    description: 'Data do último banho',
  })
  @IsOptional()
  @IsISO8601({}, { message: 'A data deve estar no formato de data válido' })
  lastBath?: string;
}
