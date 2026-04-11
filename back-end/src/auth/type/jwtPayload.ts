import { Role } from '@prisma/client';

export interface JwtPayload {
  username: string;
  sub: string;
  role: Role;
}
