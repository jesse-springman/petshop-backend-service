import { PrismaService } from '../../prisma/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

export interface UpdatePetData {
  name?: string;
  breed?: string;
  lastBath?: string;
}

@Injectable()
export class PatchPet {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: string, dto: UpdatePetData, businessId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id, businessId },
    });

    if (!pet) {
      throw new NotFoundException(`Pet com ID ${id} não encontrado`);
    }

    return this.prisma.pet.update({
      where: { id, businessId },
      data: {
        name: dto.name,
        breed: dto.breed,
        lastBath: dto.lastBath ? new Date(dto.lastBath) : undefined,
      },
    });
  }
}
