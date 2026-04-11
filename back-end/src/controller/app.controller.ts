import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCustomerBody } from '../dto/customer/create.customer';
import { UpdateCustomerDto } from '../dto/customer/update-customer';
import { PostCustomer } from '../use-cases/post-customer';
import { GetCustomer } from '../use-cases/get-customer';
import { PatchCustomer } from '../use-cases/patch-customer';
import { DeleteCustomer } from '../use-cases/delete-customer';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(
    private readonly postCustomer: PostCustomer,

    private readonly getCustomer: GetCustomer,
    private readonly patchCustomer: PatchCustomer,
    private readonly deleteCustomer: DeleteCustomer,
  ) {}

  @HttpCode(201)
  @Post('cadastro')
  async insertCustomersData(@Body() body: CreateCustomerBody) {
    return await this.postCustomer.execute(body);
  }

  @Get('clientes')
  async allCustomersData() {
    const allCustomers = await this.getCustomer.findAllClient();
    return allCustomers;
  }

  @Patch('clientes/:id')
  async updateData(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.patchCustomer.update(id, updateCustomerDto);
  }

  @Delete('clientes/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.deleteCustomer.delete(id);

    return { message: 'Cliente deletado com sucesso' };
  }
}
