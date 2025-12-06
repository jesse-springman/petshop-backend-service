import { Injectable } from '@nestjs/common';
import { InternalServerError } from 'infra/erros';
import { PrismaService } from 'prisma/database/prisma.service';

@Injectable()
export class GetCustomer {

    constructor(private readonly prisma: PrismaService) { }

    async execute() {

        try {
            const client = await this.prisma.customer.create({
                data: {
                    customer_name: 'Jessé Springman',
                    pet_name: 'Cacau'
                }
            })
            return client
        }

        catch (error: any) {
            const erroService = new InternalServerError({
                cause: error,
                statusCode: error.status
            });

            throw erroService;
        }
    }

}
