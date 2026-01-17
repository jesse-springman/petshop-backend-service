import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  UnauthorizedException,
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

console.log('VERSÃO NOVA DEPLOYADA - 2026-01-12 18:00');

@Controller()
export class AppController {
  private readonly admins = (process.env.ADMINS || '')
    .split(',')
    .map((admin) => admin.trim().toLowerCase());

  constructor(
    private readonly postCustomer: PostCustomer,
    private readonly getCustomer: GetCustomer,
    private readonly patchCustomer: PatchCustomer,
    private readonly deleteCustomer: DeleteCustomer,
  ) {}

  @Post()
  validateLogin(@Body() body: { nameClient: string }) {
    console.log('POST / recebido000!');
    console.log('Body recebido:', body);

    const name = body.nameClient.toLowerCase();

    if (!name) {
      throw new BadRequestException('Nome obrigatório');
    }

    if (this.admins.includes(name)) {
      return {
        success: true,
        userName: name,
        message: 'Acesso liberado',
      };
    }
    throw new UnauthorizedException('Acesso não autorizado');
  }

  @HttpCode(201)
  @Post('cadastro')
  async insertCustomersData(@Body() Body: CreateCustomerBody) {
    const { customer_name, pet_name } = Body;
    await this.postCustomer.execute(customer_name, pet_name);

    return {
      message: 'Cliente Cadastrado com sucesso',
      customer_name,
      pet_name,
    };
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
