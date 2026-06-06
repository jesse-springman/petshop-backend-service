import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/type/authRequest';
import { CreatePetDto } from '../dto/create-pet.dto';
import { PostPet } from './use-cases/post-pet';
import { GetPet } from './use-cases/get-pet';
import { PatchPet } from './use-cases/patch-pet';
import { DeletePet } from './use-cases/delete-pet';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Pet')
@Controller('pet')
export class PetController {
  constructor(
    private readonly postPet: PostPet,
    private readonly getPet: GetPet,
    private readonly patchPet: PatchPet,
    private readonly deletePet: DeletePet,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um pet' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pet cadastrado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token ausente ou inválido.',
  })
  async create(@Request() req: AuthRequest, @Body() body: CreatePetDto) {
    return this.postPet.execute(body, req.user.businessId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pets de um cliente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pets retornada com sucesso.',
  })
  async findAll(
    @Request() req: AuthRequest,
    @Query('customerId') customerId: string,
  ) {
    return this.getPet.findAllByCustomer(customerId, req.user.businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pet por ID' })
  @ApiParam({ name: 'id', description: 'ID do pet' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pet encontrado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pet não encontrado.',
  })
  async findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.getPet.findOne(id, req.user.businessId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do pet' })
  @ApiParam({ name: 'id', description: 'ID do pet' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pet atualizado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pet não encontrado.',
  })
  async update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.patchPet.execute(id, body, req.user.businessId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover pet' })
  @ApiParam({ name: 'id', description: 'ID do pet' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Pet removido com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pet não encontrado.',
  })
  async delete(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.deletePet.execute(id, req.user.businessId);
  }
}
