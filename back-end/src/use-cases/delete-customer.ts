import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';

@Injectable()
export class DeleteCustomer {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    const clientDelete = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!clientDelete) {
      throw new NotFoundException(`Cliente não encontrado`);
    }

    await this.prisma.customer.delete({
      where: { id },
    });
  }
}
