import { Injectable } from '@nestjs/common';
import { CreatePetDto } from '../../dto/create-pet.dto';
import { PrismaService } from '../../prisma/database/prisma.service';

@Injectable()
export class PostPet {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreatePetDto, businessId: string) {
    const pet = await this.prisma.pet.create({
      data: {
        name: dto.name,
        breed: dto.breed,
        lastBath: dto.lastBath ? new Date(dto.lastBath) : undefined,
        customerId: dto.customerId,
        businessId,
      },
    });

    return pet;
  }
}
