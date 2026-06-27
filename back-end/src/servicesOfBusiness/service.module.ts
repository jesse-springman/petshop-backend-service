import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { ServiceController } from './service.controller';
import { CreateService } from './use-cases/post-service';
import { GetService } from './use-cases/get-service';
import { UpdateService } from './use-cases/update-service';
import { DeleteService } from './use-cases/delete-service';

@Module({
  imports: [],
  controllers: [ServiceController],
  providers: [
    PrismaService,
    CreateService,
    GetService,
    UpdateService,
    DeleteService,
  ],
  exports: [GetService],
})
export class ServiceModule {}
