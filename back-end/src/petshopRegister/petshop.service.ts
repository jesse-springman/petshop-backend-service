import { BadRequestException, Injectable } from '@nestjs/common';
import { PetshopDto } from './petshop.dto';
import { PrismaService } from '../prisma/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class PetshopRegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: PetshopDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { name: dto.adiminName.toLocaleLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Nome de usuário já existe');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const petshop = await this.prisma.petshop.create({
      data: {
        name: dto.petshopName,
        plan: dto.plan,
        user: {
          create: {
            name: dto.adiminName,
            password: passwordHash,
            role: Role.ADMIN,
          },
        },
      },
    });

    return {
      message:
        'Cadastro recebido! Entraremos em contato para confirmar o pagamento.',
      petshopId: petshop.id,
    };
  }
}
