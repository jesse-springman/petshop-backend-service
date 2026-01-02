import { IsNotEmpty, Length } from 'class-validator';

export class CreateCustomerBody {
  @Length(5, 10)
  @IsNotEmpty({
    message: 'this field can not empty',
  })
  customer_name!: string;

  @Length(3, 10)
  @IsNotEmpty({
    message: 'this field can not empty',
  })
  pet_name!: string;
}
