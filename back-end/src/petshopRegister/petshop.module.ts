import { Module } from '@nestjs/common';
import { PetshopController } from './petshop.controller';
import { PrismaService } from '../prisma/database/prisma.service';
import { PetshopRegisterService } from './petshop.service';

@Module({
  controllers: [PetshopController],
  providers: [PetshopRegisterService, PrismaService],
})
export class PetshopModule {}
