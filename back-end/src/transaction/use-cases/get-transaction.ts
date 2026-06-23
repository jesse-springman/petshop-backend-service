import { BadRequestException, Injectable } from '@nestjs/common';
import { GetTransactionDto } from '../dto/get-transaction';
import { PrismaService } from '../../prisma/database/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class GetTransaction {
  constructor(private prisma: PrismaService) {}

  async execute(businessId: string, query: GetTransactionDto) {
    const where: any = { businessId };

    if (query.start || query.end) {
      const startDate = query.start ? new Date(query.start) : undefined;
      const endDate = query.end ? new Date(query.end) : undefined;
      if (
        (startDate && isNaN(startDate.getTime())) ||
        (endDate && isNaN(endDate.getTime()))
      ) {
        throw new BadRequestException('Intervalo de datas inválido');
      }

      where.createdAt = {
        ...(startDate && {gte: startDate}),
        ...(endDate && {lte: endDate})
      }

    }




    const transaction = await this.prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          select: {
            id: true,
            notes: true,
            customer: { select: { name: true } },
          },
        },
      },
    });

    //resumo financeiro
    const income = transaction
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transaction
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      transaction,
      summary: {
        income,
        expense,
        profit: income - expense,
        total: transaction.length,
      },
    };
  }
}
