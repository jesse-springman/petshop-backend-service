import { Injectable } from '@nestjs/common';

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
    const client = await this.prisma.customer.create({
      data: {
        ...dataBody,
        pet_breed: dataBody.pet_breed ?? undefined,
        last_bath: dataBody.last_bath
          ? new Date(dataBody.last_bath)
          : undefined,
      },
    });
    return client;
  }
}
