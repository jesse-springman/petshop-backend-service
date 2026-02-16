import { PrismaService } from '../../prisma/database/prisma.service';
import { Prisma } from '@prisma/client';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

interface CreateDto {
  customerId: string;
  date: string;
  notes?: string;
}

@Injectable()
export class CreateAgenda {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string, data: CreateDto) {
    const parsedDate = new Date(data.date);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Data inválida');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    try {
      const appointment = await this.prisma.appointment.create({
        data: {
          customerId: data.customerId,
          date: parsedDate,
          userId,
          notes: data.notes,
        },
      });
      return appointment;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Já existe um agendamento nesse horário');
      }
      throw error;
    }
  }
}
