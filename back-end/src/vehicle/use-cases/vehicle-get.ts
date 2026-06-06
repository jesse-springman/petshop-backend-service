import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

@Injectable()
export class GetVehicle {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByCustomer(customerId: string, businessId: string) {
    return this.prisma.vehicle.findMany({
      where: { customerId, businessId },
    });
  }

  async findOne(id: string, businessId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, businessId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }

    return vehicle;
  }
}
