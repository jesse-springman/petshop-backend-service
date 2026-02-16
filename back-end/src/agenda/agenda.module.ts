import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { AgendaController } from './agenda.controller';
import { CreateAgenda } from './use-cases/post-agenda';
import { GetAgenda } from './use-cases/get-agenda';
import { UpdateAgenda } from './use-cases/patch-agenda';
import { DeleteScheduling } from './use-cases/delete-agenda';

@Module({
  imports: [],
  controllers: [AgendaController],
  providers: [
    PrismaService,
    CreateAgenda,
    GetAgenda,
    UpdateAgenda,
    DeleteScheduling,
  ],
})
export class AgendaModule {}
