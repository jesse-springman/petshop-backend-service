import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private get admins(): string[] {
    return (process.env.ADMINS || '')
      .split(',')
      .map((adm) => adm.trim().toLowerCase());
  }

  validateAdmin(nameClient: string): { username: string; role: string } {
    const name = nameClient?.toLowerCase();

    if (!this.admins.includes(name)) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    return { username: name, role: 'admin' };
  }
}
