import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { AuthUser } from './type/auth-type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(nameClient: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { name: nameClient.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Acesso não autorizado');
    }
    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }
}
