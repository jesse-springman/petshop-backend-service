import { Role, Commerce } from '@prisma/client';

export interface JwtPayload {
  username: string;
  sub: string;
  role: Role;
  businessId: string;
  commerce: Commerce;
}
