import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/database/prisma.service";

@Injectable()
export class GetCustomer {
    constructor(private readonly prisma: PrismaService){}

    async findAllClient() {
     const customers = await this.prisma.customer.findMany();
    
       return customers
    }
}