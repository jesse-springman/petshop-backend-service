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
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { GetAgendaDto } from './dto/get-agenda.dto';
import { CreateAgenda } from './use-cases/post-agenda';
import { GetAgenda } from './use-cases/get-agenda';
import { PatchAgendaDTO } from './dto/update-agenda.dto';
import { UpdateAgenda } from './use-cases/patch-agenda';
import { DeleteScheduling } from './use-cases/delete-agenda';

interface AuthRequest {
  user: {
    id: string;
  };
}

@UseGuards(AuthGuard)
@Controller('agenda')
export class AgendaController {
  constructor(
    private readonly createAgenda: CreateAgenda,
    private readonly getAgenda: GetAgenda,
    private readonly updateAgenda: UpdateAgenda,
    private readonly deleteScheduling: DeleteScheduling,
  ) {}

  @Post()
  async create(@Request() req: AuthRequest, @Body() body: CreateAgendaDto) {
    return this.createAgenda.execute(req.user.id, body);
  }

  @Get()
  async findAll(@Request() req: AuthRequest, @Query() query: GetAgendaDto) {
    return this.getAgenda.execute(req.user.id, query);
  }

  //Só o profissional dono do agendemente pode alterar
  //não sera permitido alterar datas, somente o status de acordo com o enum
  @Patch(':id/status')
  async updateStatus(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: PatchAgendaDTO,
  ) {
    return this.updateAgenda.execute(req.user.id, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAgenda(@Request() res: AuthRequest, @Param('id') id: string) {
    return this.deleteScheduling.execute(res.user.id, id);
  }
}
