import { IsString, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  pet_name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  number_customer?: string;

  @IsOptional()
  @IsString()
  pet_breed?: string;

  @IsOptional()
  last_bath?: string;
}
