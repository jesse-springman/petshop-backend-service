import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCustomerBody {
  @IsString({ message: 'O nome deve ser um texto' })
  @Length(5, 10, { message: 'O nome deve conter no mínimo 5 letras' })
  @IsNotEmpty({ message: 'O nome do dono é obrigátorio' })
  customer_name!: string;

  @IsString({ message: 'O nome do pet deve ser um texto' })
  @Length(3, 10, { message: 'O nome do pet deve conter no mínimo 3 letras' })
  @IsNotEmpty({ message: 'O nome do Pet é obrigatório' })
  pet_name!: string;

  @IsString({ message: 'O endereço deve ser um texto' })
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  address!: string;

  @IsString({ message: 'O telefone deve ser texto' })
  @IsNotEmpty({ message: 'o número é obrigatório' })
  number_customer!: string;

  @IsOptional()
  @IsString({ message: 'A raça deve ser um texto' })
  pet_breed?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'A data deve estar no formato de data válido' })
  last_bath?: string;
}
