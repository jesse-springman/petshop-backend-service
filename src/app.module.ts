import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { PrismaService } from 'prisma/database/prisma.service';
import { GetCustomer } from './use-cases/get-customer';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, GetCustomer],
})
export class AppModule {}
