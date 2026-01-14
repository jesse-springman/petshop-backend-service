import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';

@Injectable()
export class DeleteCustomer {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<boolean> {
    const clientDelete = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!clientDelete) {
      return false;
    }

    await this.prisma.customer.delete({
      where: { id },
    });
    return true;
  }
}
