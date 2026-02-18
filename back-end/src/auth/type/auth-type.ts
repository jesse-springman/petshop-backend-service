import { Roles } from '@prisma/client';

export type AuthUser = {
  id: string;
  name: string;
  role: Roles;
};
