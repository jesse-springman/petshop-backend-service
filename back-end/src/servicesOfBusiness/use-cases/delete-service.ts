import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/database/prisma.service';

@Injectable()
export class DeleteService {
  constructor(private prisma: PrismaService) {}

  async execute(id: string, businessId: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (service.businessId !== businessId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esse serviço',
      );
    }

    //nao delete, so inativa , preserva historico de agendamentos que usam esse serviço
    return this.prisma.service.update({
      where: { id },
      data: { active: false },
    });
  }
}
