import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const petshop = await prisma.petshop.findFirst();

  if (!petshop) {
    throw new Error('Nenhum petshop encontrado');
  }

  const senha = await bcrypt.hash('cacau', 10);

  const user = await prisma.user.create({
    data: {
      name: 'jesse',
      password: senha,
      role: Role.ADMIN,
      petshopId: petshop.id,
    },
  });

  console.log('user criado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
