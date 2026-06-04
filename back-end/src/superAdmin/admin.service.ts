import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { UpdateStatusDto } from '../prisma/update-business.dto';

@Injectable()
export class ServicesBusiness {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBusiness() {
    return this.prisma.petshop.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          where: { role: 'ADMIN' },
          select: { name: true },
        },
      },
    });
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const business = await this.prisma.petshop.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException('Comercio não encontrado');
    }

    return this.prisma.petshop.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
