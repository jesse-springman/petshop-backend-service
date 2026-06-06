import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota', description: 'Marca do veículo' })
  @IsString({ message: 'A marca deve ser um texto' })
  @IsNotEmpty({ message: 'A marca é obrigatória' })
  brand!: string;

  @ApiProperty({ example: 'Corolla', description: 'Modelo do veículo' })
  @IsString({ message: 'O modelo deve ser um texto' })
  @IsNotEmpty({ message: 'O modelo é obrigatório' })
  model!: string;

  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo' })
  @IsString({ message: 'A placa deve ser um texto' })
  @IsOptional()
  plate?: string;

  @ApiProperty({
    example: 'uuid-do-cliente',
    description: 'ID do cliente dono do veículo',
  })
  @IsString()
  @IsNotEmpty({ message: 'O customerId é obrigatório' })
  customerId!: string;
}
