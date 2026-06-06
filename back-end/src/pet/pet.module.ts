import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { PetController } from './pet.controller';
import { PostPet } from './use-cases/post-pet';
import { GetPet } from './use-cases/get-pet';
import { PatchPet } from './use-cases/patch-pet';
import { DeletePet } from './use-cases/delete-pet';

@Module({
  controllers: [PetController],
  providers: [PrismaService, PostPet, GetPet, PatchPet, DeletePet],
})
export class PetModule {}
