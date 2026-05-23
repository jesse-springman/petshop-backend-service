import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../auth/type/jwtPayload';

export function getTenantId(user: JwtPayload): string {
  if (user?.petshopId) throw new UnauthorizedException('Sem petshop vinculado');
  return user.petshopId;
}
