import { GetAgendaDto } from '../dto/get-agenda.dto';
import { PrismaService } from '../../prisma/database/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class GetAgenda {
  constructor(private prisma: PrismaService) {}

  async execute(userId: string, query: GetAgendaDto) {
    const startDate = new Date(query.start);
    const endDate = new Date(query.end);

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
      },
      include: {
        customer: {
          select: {
            id: true,
            customer_name: true,
            pet_name: true,
            pet_breed: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return appointments ?? [];
  }
}
