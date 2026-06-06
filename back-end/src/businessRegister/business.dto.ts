import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '@prisma/client';
import { Commerce } from '@prisma/client';

export class BusinessDto {
  @ApiProperty({ example: 'Business da Cris' })
  @IsString()
  @IsNotEmpty()
  businessName!: string;

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

  @ApiProperty({
    example: 'PETSHOP',
    enum: Commerce,
    description: 'Tipo de comércio',
  })
  @IsEnum(Commerce, { message: 'Tipo de comércio inválido' })
  commerce!: Commerce;
}
