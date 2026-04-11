import {
  Body,
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
  Query,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { GetAgendaDto } from './dto/get-agenda.dto';
import { CreateAgenda } from './use-cases/post-agenda';
import { GetAgenda } from './use-cases/get-agenda';
import { PatchAgendaDto } from './dto/update-agenda.dto';
import { UpdateAgenda } from './use-cases/patch-agenda';
import { DeleteScheduling } from './use-cases/delete-agenda';
import { AuthRequest } from '../auth/type/authRequest';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Agenda')
@Controller('agenda')
export class AgendaController {
  constructor(
    private readonly createAgenda: CreateAgenda,
    private readonly getAgenda: GetAgenda,
    private readonly updateAgenda: UpdateAgenda,
    private readonly deleteScheduling: DeleteScheduling,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Agendamento criado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos no corpo da requisição.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  async create(@Request() req: AuthRequest, @Body() body: CreateAgendaDto) {
    return this.createAgenda.execute(req.user.sub, body);
  }

  @Get()
  @ApiOperation({ summary: 'Lista de agendamentos' })
  @ApiQuery({
    name: 'start',
    required: true,
    description: 'Data de início do intervalo (ISO 8601). Ex: 2025-01-01',
    example: '2025-01-01',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    description: 'Data de fim do intervalo (ISO 8601). Ex: 2025-01-31',
    example: '2025-01-31',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de agendamentos retornada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  async findAll(
    @Request() req: AuthRequest,
    @Query('start') { start }: GetAgendaDto,
    @Query('end') { end }: GetAgendaDto,
  ) {
    return this.getAgenda.execute(req.user.sub, { start, end });
  }

  //Só o profissional dono do agendemente pode alterar
  //não sera permitido alterar datas, somente o status de acordo com o enum

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  @ApiParam({
    name: 'id',
    description: 'ID único do agendamento',
    example: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status do agendamento atualizado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Status inválido ou dados incorretos.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Você não tem permissão para alterar este agendamento.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agendamento não encontrado.',
  })
  async updateStatus(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: PatchAgendaDto,
  ) {
    return this.updateAgenda.execute(req.user.sub, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um agendamento pelo ID ' })
  @ApiParam({
    name: 'id',
    description: 'ID único do agendamento',
    example: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Agendamento excluído com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Você não tem permissão para excluir este agendamento.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agendamento não encontrado.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAgenda(@Request() res: AuthRequest, @Param('id') id: string) {
    return this.deleteScheduling.execute(res.user.sub, id);
  }
}
