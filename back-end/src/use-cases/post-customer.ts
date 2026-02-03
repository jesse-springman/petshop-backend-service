import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/database/prisma.service';

export interface DataCustomer {
  customer_name: string;
  pet_name: string;
  address: string;
  number_customer: string;
  pet_breed?: string | null;
  last_bath?: string | Date | null;
}

@Injectable()
export class PostCustomer {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dataBody: DataCustomer) {
    let lastBath: Date | undefined;

    if (dataBody.last_bath) {
      const parsed = new Date(dataBody.last_bath);

      if (isNaN(parsed.getTime())) {
        throw new BadRequestException('Data de último banho inválida');
      }

      lastBath = parsed;
    }

    const client = await this.prisma.customer.create({
      data: {
        customer_name: dataBody.customer_name,
        pet_name: dataBody.pet_name,
        address: dataBody.address,
        number_customer: dataBody.number_customer,

        pet_breed: dataBody.pet_breed ?? undefined,
        last_bath: lastBath ?? undefined,
      },
    });
    return client;
  }
}
