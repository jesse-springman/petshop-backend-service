import { Test, TestingModule } from '@nestjs/testing';
import { PatchCustomer } from '../../src/customer/use-cases/patch-customer';
import { PrismaService } from '../../src/prisma/database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PatchCustomer', () => {
  let service: PatchCustomer;

  const mockPrisma = {
    customer: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchCustomer,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PatchCustomer>(PatchCustomer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const id = '123';
  const businessId = 'business-test-id';

  const existingCustomer = {
    id,
    name: 'João',
    phone: '11111111111',
    address: 'Rua Antiga, 100',
    businessId,
    createdAt: new Date(),
  };

  const dto = {
    name: 'Nome Novo',
    phone: '19999900990',
    address: 'Rua Nova, 345',
  };

  describe('update', () => {
    it('should update customer when found', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(existingCustomer);
      mockPrisma.customer.update.mockResolvedValue({
        ...existingCustomer,
        ...dto,
      });

      const result = await service.update(id, dto, businessId);

      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id, businessId },
      });

      expect(mockPrisma.customer.update).toHaveBeenCalledWith({
        where: { id, businessId },
        data: {
          name: dto.name,
          address: dto.address,
          phone: dto.phone,
        },
      });

      expect(result).toEqual({ ...existingCustomer, ...dto });
    });

    it('should throw NotFoundException when customer not found', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      await expect(service.update(id, dto, businessId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should do partial update with only fields sent', async () => {
      const partialDto = { name: 'Nome Atualizado' };

      mockPrisma.customer.findUnique.mockResolvedValue(existingCustomer);
      mockPrisma.customer.update.mockResolvedValue({
        ...existingCustomer,
        name: 'Nome Atualizado',
      });

      const result = await service.update(id, partialDto, businessId);

      expect(mockPrisma.customer.update).toHaveBeenCalledWith({
        where: { id, businessId },
        data: {
          name: partialDto.name,
          address: undefined,
          phone: undefined,
        },
      });

      expect(result).toEqual({ ...existingCustomer, name: 'Nome Atualizado' });
    });
  });
});
