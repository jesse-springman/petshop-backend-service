import { PrismaService } from "prisma/database/prisma.service";
export declare class GetCustomer {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllClient(): Promise<{
        id: string;
        customer_name: string;
        pet_name: string;
        created_at: Date;
    }[]>;
}
