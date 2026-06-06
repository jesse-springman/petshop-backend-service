import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { CreateVehicleDto } from '../../dto/create-vehicle.dto';

@Injectable()
export class PostVehicle {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateVehicleDto, businessId: string) {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        brand: dto.brand,
        model: dto.model,
        plate: dto.plate ?? null,
        customerId: dto.customerId,
        businessId,
      },
    });

    return vehicle;
  }
}
