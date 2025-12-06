import { Controller, Get } from '@nestjs/common';
import { GetCustomer } from 'src/use-cases/get-customer';

@Controller('customers')
export class AppController {
  constructor
    (private readonly getCustomer : GetCustomer,
    ) { }



  @Get()
    async customersData(){
      await this.getCustomer.execute();
    }
  
}
