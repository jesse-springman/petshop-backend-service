import {
  Body,
  Controller,
  UseGuards,
  Post,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { GetAgendaDto } from './dto/get-agenda.dto';
import { CreateAgenda } from './use-cases/post-agenda';
import { GetAgenda } from './use-cases/get-agenda';

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
  ) {}

  @Post()
  async create(@Request() req: AuthRequest, @Body() body: CreateAgendaDto) {
    return this.createAgenda.execute(req.user.id, body);
  }

  @Get()
  async findAll(@Request() req: AuthRequest, @Query() query: GetAgendaDto) {
    return this.getAgenda.execute(req.user.id, query);
  }
}
