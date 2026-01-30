import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  Param,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { CreateCustomerBody } from '../dto/create.customer';
import { UpdateCustomerDto } from '../dto/update-customer';
import { PostCustomer } from '../use-cases/post-customer';
import { GetCustomer } from '../use-cases/get-customer';
import { PatchCustomer } from '../use-cases/patch-customer';
import { DeleteCustomer } from '../use-cases/delete-customer';

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
  async insertCustomersData(@Body() Body: CreateCustomerBody) {
    return await this.postCustomer.execute(Body);
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
    try {
      await this.patchCustomer.update(id, updateCustomerDto);
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw Error('Erro ao atualizar cliente');
    }
  }

  @Delete('clientes/:id')
  async delete(@Param('id') id: string) {
    const deleted = await this.deleteCustomer.delete(id);

    if (!deleted) {
      throw new NotFoundException(`Cliente não encontrado`);
    }

    return { message: 'Cliente deletado com sucesso' };
  }
}
