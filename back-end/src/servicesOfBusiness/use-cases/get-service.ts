import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

@Injectable()
export class GetService {
  constructor(private prisma: PrismaService) {}

  async execute(businessId: string) {
    return this.prisma.service.findMany({
      where: { businessId, active: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        price: true,
        active: true,
        createdAt: true,
      },
    });
  }
}
