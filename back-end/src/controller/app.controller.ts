import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCustomerDto } from '../dto/customer/create.customer';
import { UpdateCustomerDto } from '../dto/customer/update-customer';
import { PostCustomer } from '../use-cases/post-customer';
import { GetCustomer } from '../use-cases/get-customer';
import { PatchCustomer } from '../use-cases/patch-customer';
import { DeleteCustomer } from '../use-cases/delete-customer';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Customers')
@Controller()
export class AppController {
  constructor(
    private readonly postCustomer: PostCustomer,

    private readonly getCustomer: GetCustomer,
    private readonly patchCustomer: PatchCustomer,
    private readonly deleteCustomer: DeleteCustomer,
  ) {}

  @Post('cadastro')
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Um novo cliente foi criado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos no corpo da requisição.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  @HttpCode(HttpStatus.CREATED)
  async insertCustomersData(@Body() body: CreateCustomerDto) {
    return await this.postCustomer.execute(body);
  }

  @Get('clientes')
  @ApiOperation({ summary: 'Lista de todos os clientes cadastrados' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de clientes retornado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  async allCustomersData() {
    const allCustomers = await this.getCustomer.findAllClient();
    return allCustomers;
  }

  @Patch('clientes/:id')
  @ApiOperation({ summary: 'Atualiza dados do cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID único do cliente',
    example: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados do cliente atualizado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados incorretos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente não encontrado.',
  })
  async updateData(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    await this.patchCustomer.update(id, updateCustomerDto);
  }

  @Delete('clientes/:id')
  @ApiOperation({ summary: 'Remove um cliente pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único do cliente',
    example: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cliente removido com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Você não tem permissão para excluir este cliente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente não encontrado',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteCustomer.delete(id);

    return { message: 'Cliente deletado com sucesso' };
  }
}
