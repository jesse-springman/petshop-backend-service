import { Role, Commerce } from '@prisma/client';

export type AuthUser = {
  id: string;
  name: string;
  role: Role;
  businessId: string;
  businessName: string;
  commerce: Commerce;
};
