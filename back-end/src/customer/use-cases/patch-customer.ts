import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { UpdateCustomerDto } from '../../dto/customer/update-customer';

@Injectable()
export class PatchCustomer {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    businessId: string,
  ) {
    const customer = await this.prisma.customer.findUnique({
      where: { id, businessId },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return this.prisma.customer.update({
      where: { id, businessId },
      data: {
        name: updateCustomerDto.name,
        address: updateCustomerDto.address,
        phone: updateCustomerDto.phone,
      },
    });
  }
}
