import {
  IsOptional,
  IsString,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
