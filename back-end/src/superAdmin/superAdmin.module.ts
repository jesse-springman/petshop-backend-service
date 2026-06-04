import { Module } from '@nestjs/common';
import { SuperAdminController } from './superAdmin.controller';
import { JwtModule } from '@nestjs/jwt';
import { ServicesBusiness } from './admin.service';
import { PrismaService } from '../prisma/database/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [SuperAdminController],
  providers: [ServicesBusiness, PrismaService],
})
export class SuperAdminModule {}
