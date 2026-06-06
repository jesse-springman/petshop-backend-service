import { BadRequestException, Injectable } from '@nestjs/common';
import { BusinessDto } from './business.dto';
import { PrismaService } from '../prisma/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class BusinessRegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: BusinessDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { name: dto.adiminName.toLocaleLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Nome de usuário já existe');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const business = await this.prisma.business.create({
      data: {
        name: dto.businessName,
        plan: dto.plan,
        commerce: dto.commerce,
        users: {
          create: {
            name: dto.adiminName,
            password: passwordHash,
            role: Role.ADMIN,
          },
        },
      },

      include: { users: true },
    });

    console.log('Business criado:', JSON.stringify(business, null, 2));

    return {
      message:
        'Cadastro recebido! Entraremos em contato para confirmar o pagamento.',
      businessId: business.id,
    };
  }
}
