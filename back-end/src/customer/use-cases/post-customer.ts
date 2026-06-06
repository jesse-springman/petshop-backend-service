import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

export interface DataCustomer {
  name: string;
  address?: string;
  phone?: string;
}

@Injectable()
export class PostCustomer {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dataBody: DataCustomer, businessId: string) {
    const customer = await this.prisma.customer.create({
      data: {
        businessId,
        name: dataBody.name,
        address: dataBody.address,
        phone: dataBody.phone,
      },
    });

    return customer;
  }
}
