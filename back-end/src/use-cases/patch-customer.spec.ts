import { Test, TestingModule } from '@nestjs/testing';
import { PatchCustomer } from './patch-customer';
import { PrismaService } from '../prisma/database/prisma.service';

describe('UpdateMock', () => {
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

  describe('UpdatedCustomer', () => {
    const id = '123';
    const dto = { customer_name: 'nomeNovo', pet_name: 'petNovo' };

    it('shoud update customer when found', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({
        id,
        customer_name: 'antigo',
        pet_name: 'antigo',
      });

      mockPrisma.customer.update.mockResolvedValue({ id, ...dto });

      const result = await service.update(id, dto);

      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });

      expect(mockPrisma.customer.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });

      expect(result).toEqual({ id, ...dto });
    });

    it('should return status 204', async () => {
      mockPrisma.customer.update.mockResolvedValue(undefined);

      const result = await service.update(id, dto);
      expect(result).toBeUndefined();
    });

    it('should update just fields send, partial update', async () => {
      const partialDto = { pet_name: 'petAtualizado' };

      mockPrisma.customer.findUnique.mockResolvedValue({
        id,
        customer_name: 'joao',
        pet_name: 'toby',
      });
      mockPrisma.customer.update.mockResolvedValue({
        id,
        customer_name: 'joao',
        pet_name: 'petAtualizado',
      });

      const result = await service.update(id, partialDto);

      expect(mockPrisma.customer.update).toHaveBeenCalledWith({
        where: { id },
        data: partialDto,
      });

      expect(result.pet_name).toBe('petAtualizado');
      expect(result.customer_name).toBe('joao');
    });
  });
});
