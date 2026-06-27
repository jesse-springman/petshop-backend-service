import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';
import { UpdateServiceDto } from '../dto/update-service';

@Injectable()
export class UpdateService {
  constructor(private prisma: PrismaService) {}

  async execute(id: string, dto: UpdateServiceDto, businessId: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (service.businessId !== businessId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este serviço',
      );
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.price && { price: dto.price }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });
  }
}
