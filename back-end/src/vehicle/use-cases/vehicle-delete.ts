import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

@Injectable()
export class DeleteVehicle {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, businessId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, businessId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }

    await this.prisma.vehicle.delete({ where: { id } });
  }
}
