import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';

export class PetshopDto {
  @ApiProperty({ example: 'Petshop da Cris' })
  @IsString()
  @IsNotEmpty()
  petshopName!: string;

  @ApiProperty({ example: 'Cris' })
  @IsNotEmpty()
  @IsString()
  adiminName!: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: Plan, example: Plan.BASIC })
  @IsEnum(Plan)
  plan!: Plan;
}
