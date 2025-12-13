import { PrismaService } from '../../prisma/database/prisma.service';
export declare class PostCustomer {
    private readonly prisma;
    constructor(prisma: PrismaService);
    execute(customer_name: any, pet_name: any): Promise<{
        id: string;
        customer_name: string;
        pet_name: string;
        created_at: Date;
    }>;
}
