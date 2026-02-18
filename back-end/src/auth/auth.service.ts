import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { AuthUser } from './type/auth-type';
import * as bcrypt from 'bcrypt';
import { Roles } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(nameClient: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.users.findFirst({
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
      role: user.roles,
    };
  }

  async register(
    currentUser: { id: string; role: string },
    dataBodyReq: { name: string; password: string; role?: Roles },
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas ADMIN pode criar usuários');
    }

    const passwordHashed = await bcrypt.hash(dataBodyReq.password, 10);

    const newUser = await this.prisma.users.create({
      data: {
        name: dataBodyReq.name.toLowerCase(),
        password: passwordHashed,
        roles: dataBodyReq.role ?? 'USER',
      },
    });
    return newUser;
  }
}
