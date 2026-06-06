import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { PrismaService } from '../prisma/database/prisma.service';
import { BusinessRegisterService } from './business.service';

@Module({
  controllers: [BusinessController],
  providers: [BusinessRegisterService, PrismaService],
})
export class BusinessModule {}
