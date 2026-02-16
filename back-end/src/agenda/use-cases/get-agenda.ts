import { PrismaService } from '../../prisma/database/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';

export interface dtoAppointments {
  start: string;
  end: string;
}

@Injectable()
export class GetAgenda {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string, { start, end }: dtoAppointments) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Intervalo de datas inválido');
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lt: endDate,
        },

        status: 'SCHEDULED',
      },
      include: {
        customer: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    return appointments;
  }
}
