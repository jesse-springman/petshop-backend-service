import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { CreateServiceDto } from '../dto/create-service';

@Injectable()
export class CreateService {
  constructor(private prisma: PrismaService) {}

  async execute(dto: CreateServiceDto, businessId: string) {
    const existing = await this.prisma.service.findFirst({
      where: {
        name: { equals: dto.name, mode: 'insensitive' },
        businessId,
        active: true,
      },
    });

    if (existing) {
      throw new BadRequestException(`Serviço "${dto.name}" já esta cadastrado`);
    }

    return this.prisma.service.create({
      data: {
        name: dto.name,
        price: dto.price.toString(),
        businessId,
      },
    });
  }
}
