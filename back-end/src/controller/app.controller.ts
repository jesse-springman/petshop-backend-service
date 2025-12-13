import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CreateCustomerBody } from '../dto/create.customer';
import { PostCustomer } from '../use-cases/post-customer';
import { GetCustomer } from '../use-cases/get-customer';


@Controller()
export class AppController {
  constructor
    (private readonly postCustomer : PostCustomer,
     private readonly getCustomer : GetCustomer
    ) { }


  @HttpCode(201)  
  @Post('cadastro')
    async insertCustomersData(@Body()Body: CreateCustomerBody){
      const { customer_name, pet_name } = Body
      await this.postCustomer.execute(customer_name, pet_name );

      return{
        message : 'Cliente Cadastrado com sucesso',
        customer_name,
        pet_name
      }
    }


  @Get('customers')
    async allCustomersData(){
      const allCustomers = await this.getCustomer.findAllClient();
      return allCustomers ;
      
    }
  
}
