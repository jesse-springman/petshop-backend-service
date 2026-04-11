import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
