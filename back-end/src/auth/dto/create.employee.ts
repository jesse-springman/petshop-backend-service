import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'João Pedro',
    description: 'Nome do novo funcionário',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do novo funcionário',
  })
  @IsString()
  password!: string;

  @ApiProperty({ enum: Role, required: false, example: 'USER' })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
