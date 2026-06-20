import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

@Injectable()
export class DeleteTransaction {
  constructor(private prisma: PrismaService) {}

  async execute(id: string, businessId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    if (transaction.businessId !== businessId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir esta transação',
      );
    }

    //nao permite excluir transaçao vinculdas  a agendamentos
    if (transaction.appointmentId) {
      throw new ForbiddenException(
        'Transações geradas automaticamente por agendamentos não podem ser excluídas',
      );
    }

    return this.prisma.transaction.delete({ where: { id } });
  }
}
