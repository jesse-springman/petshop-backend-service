import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

@Injectable()
export class DeletePet {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, businessId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id, businessId },
    });

    if (!pet) {
      throw new NotFoundException(`Pet com ID ${id} não encontrado`);
    }

    await this.prisma.pet.delete({ where: { id } });
  }
}
