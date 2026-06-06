import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function scriptAdmin() {
  const hashed = await bcrypt.hash('kombi20', 10);

  const business = await prisma.business.create({
    data: {
      name: 'Administração',
      plan: 'BASIC',
      commerce: 'PETSHOP',
      status: 'ACTIVE',
    },
  });

  const admin = await prisma.user.create({
    data: {
      businessId: business.id,
      name: 'jesse',
      password: hashed,
      role: 'SUPERADMIN',
    },
  });

  console.log('Business criado:', business);
  console.log('Admin criado:', admin);
}

scriptAdmin()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
