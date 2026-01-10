import { IsString, IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  pet_name?: string;
}
