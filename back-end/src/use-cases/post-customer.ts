import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/database/prisma.service';

@Injectable()
export class PostCustomer {
  constructor(private readonly prisma: PrismaService) {}

  async execute(customer_name: string, pet_name: string) {
    const client = await this.prisma.customer.create({
      data: {
        customer_name,
        pet_name,
      },
    });
    return client;
  }
}
