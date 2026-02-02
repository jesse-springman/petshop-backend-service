import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { UpdateCustomerDto } from '../dto/update-customer';

@Injectable()
export class PatchCustomer {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const clientUpdate = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!clientUpdate) {
      throw new NotFoundException(`Cliente do ID ${id} não encontrado`);
    }
    let lastBath: Date | undefined;

    if (updateCustomerDto.last_bath) {
      const parsed = new Date(updateCustomerDto.last_bath);

      if (isNaN(parsed.getTime())) {
        throw new BadRequestException('Data inválida');
      }
      lastBath = parsed;
    }

    return this.prisma.customer.update({
      where: { id },
      data: {
        ...updateCustomerDto,
        last_bath: lastBath,
      },
    });
  }
}
