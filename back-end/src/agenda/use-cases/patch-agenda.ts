import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { PatchAgendaDTO } from '../dto/update-agenda.dto';

@Injectable()
export class UpdateAgenda {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, agendaId: string, data: PatchAgendaDTO) {
    const agenda = await this.prisma.appointment.findUnique({
      where: { id: agendaId },
    });

    if (!agenda) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    //u, user não pode fazer alteração de outro user
    if (agenda.userId !== userId) {
      throw new ForbiddenException('Você não pode alterar esse agendamento');
    }

    return this.prisma.appointment.update({
      where: { id: agendaId },
      data: {
        status: data.status,
      },
    });
  }
}
