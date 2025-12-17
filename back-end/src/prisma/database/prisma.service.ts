import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
    await this.$connect();
  console.log('DATABASE_URL API:', process.env.DATABASE_URL);
  console.log(process.env.ttt);
  
    }
    
    

   async onModuleDestroy() {
    await this.$disconnect();
   } 
}