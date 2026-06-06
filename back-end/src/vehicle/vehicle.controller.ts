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
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { PostVehicle } from './use-cases/vehicle-post';
import { GetVehicle } from './use-cases/vehicle-get';
import { PatchVehicle } from './use-cases/vehicle-patch';
import { UpdateVehicleData } from './use-cases/vehicle-patch';
import { DeleteVehicle } from './use-cases/vehicle-delete';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly postVehicle: PostVehicle,
    private readonly getVehicle: GetVehicle,
    private readonly patchVehicle: PatchVehicle,
    private readonly deleteVehicle: DeleteVehicle,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um veículo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Veículo cadastrado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token ausente ou inválido.',
  })
  async create(@Request() req: AuthRequest, @Body() body: CreateVehicleDto) {
    return this.postVehicle.execute(body, req.user.businessId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar veículos de um cliente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de veículos retornada com sucesso.',
  })
  async findAll(
    @Request() req: AuthRequest,
    @Query('customerId') customerId: string,
  ) {
    return this.getVehicle.findAllByCustomer(customerId, req.user.businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar veículo por ID' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Veículo encontrado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Veículo não encontrado.',
  })
  async findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.getVehicle.findOne(id, req.user.businessId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Veículo atualizado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Veículo não encontrado.',
  })
  async update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: UpdateVehicleData,
  ) {
    return this.patchVehicle.execute(id, body, req.user.businessId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Veículo removido com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Veículo não encontrado.',
  })
  async delete(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.deleteVehicle.execute(id, req.user.businessId);
  }
}
