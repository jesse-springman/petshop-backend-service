import { Module } from '@nestjs/common';
import { AgendaController } from './agenda.controller';
import { CreateAgenda } from './use-cases/post-agenda';
import { GetAgenda } from './use-cases/get-agenda';

@Module({
  imports: [],
  controllers: [AgendaController],
  providers: [CreateAgenda, GetAgenda],
})
export class AgendaModule {}
