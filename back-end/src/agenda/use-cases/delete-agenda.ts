import { PrismaService } from '../../prisma/database/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class DeleteScheduling {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string, schedulingId: string) {
    const scheduling = await this.prisma.appointment.findUnique({
      where: { id: schedulingId },
    });

    console.log(scheduling);

    if (!scheduling) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (scheduling.userId !== userId) {
      throw new ForbiddenException('Você não pode excluir esse agendamento');
    }

    await this.prisma.appointment.delete({
      where: { id: schedulingId },
    });

    return { message: 'Agendamento deletado com sucesso' };
  }
}
