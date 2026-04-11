import { CreateEmployeeDto } from '../auth/dtoEmployee/create.user';
import { PrismaService } from '../prisma/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class Register {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    currentUser: { id: string; role: string },
    dataBodyReq: CreateEmployeeDto,
  ) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas ADMIN pode criar usuários');
    }

    const passwordHashed = await bcrypt.hash(dataBodyReq.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: dataBodyReq.name.toLowerCase(),
        password: passwordHashed,
        role: dataBodyReq.role ?? 'USER',
      },
    });

    return newUser;
  }
}
