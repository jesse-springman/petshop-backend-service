import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { CreateTransactionDto } from '../dto/transaction.dto';

@Injectable()
export class CreateTransaction {
  constructor(private primsa: PrismaService) {}

  async execute(dto: CreateTransactionDto, businessId: string) {
    if (dto.appointmentsId) {
      const existing = await this.primsa.transaction.findUnique({
        where: { appointmentId: dto.appointmentsId },
      });

      if (existing) {
        throw new BadRequestException(
          'Já existe uma transação vincula a este agendamento',
        );
      }
    }

    return this.primsa.transaction.create({
      data: {
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        category: dto.category,
        businessId,
        appointmentId: dto.appointmentsId,
      },
    });
  }
}
