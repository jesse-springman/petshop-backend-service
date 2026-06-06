import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class GetPet {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByCustomer(customerId: string, businessId: string) {
    const pets = await this.prisma.pet.findMany({
      where: { customerId, businessId },
    });
    return pets;
  }

  async findOne(id: string, businessId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id, businessId },
    });

    if (!pet) {
      throw new NotFoundException(`Pet com ID ${id} não encontrado`);
    }

    return pet;
  }
}
