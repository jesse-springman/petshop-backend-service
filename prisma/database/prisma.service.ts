import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
    await this.$connect();
  console.log('DATABASE_URL API:', process.env.DATABASE_URL);
    }
    

   async onModuleDestroy() {
    await this.$disconnect();
   } 
}