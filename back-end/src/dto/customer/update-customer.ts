import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create.customer';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
