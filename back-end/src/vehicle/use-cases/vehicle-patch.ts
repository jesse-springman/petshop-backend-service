import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

export interface UpdateVehicleData {
  brand?: string;
  model?: string;
  plate?: string;
}

@Injectable()
export class PatchVehicle {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, dto: UpdateVehicleData, businessId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id, businessId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }

    return this.prisma.vehicle.update({
      where: { id, businessId },
      data: {
        brand: dto.brand,
        model: dto.model,
        plate: dto.plate,
      },
    });
  }
}
