import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setPetshopId() {
  const petshop = await prisma.petshop.create({
    data: { name: 'newPettz', plan: 'BASIC' },
  });

  await prisma.user.updateMany({ data: { petshopId: petshop.id } });
  await prisma.customer.updateMany({ data: { petshopId: petshop.id } });
  await prisma.appointment.updateMany({ data: { petshopId: petshop.id } });

  console.log('Feito! PetshopId:', petshop.id);
}

setPetshopId();
