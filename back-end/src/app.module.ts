import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { PrismaService } from 'prisma/database/prisma.service';
import { PostCustomer } from './use-cases/post-customer';
import { GetCustomer } from './use-cases/get-customer';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, PostCustomer, GetCustomer],
})
export class AppModule {}
