import {
  IsString,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  isNotEmpty,
} from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;
}
