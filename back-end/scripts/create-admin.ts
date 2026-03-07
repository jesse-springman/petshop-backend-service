import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const prisma = new PrismaClient();

async function scriptAdmin() {
  const hashed = await bcrypt.hash('kombi20', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'jesse',
      password: hashed,
      role: 'ADMIN',
    },
  });

  console.log('Admin criado:', admin);
}

scriptAdmin()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
