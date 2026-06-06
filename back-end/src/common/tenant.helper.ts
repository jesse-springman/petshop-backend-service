import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../auth/type/jwtPayload';

export function getTenantId(user: JwtPayload): string {
  if (user?.businessId)
    throw new UnauthorizedException('Sem petshop vinculado');
  return user.businessId;
}
