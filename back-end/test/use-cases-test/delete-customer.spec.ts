import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCustomer } from '../../src/use-cases/delete-customer';
import { PrismaService } from '../../src/prisma/database/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('DELETE client', () => {
  let service: DeleteCustomer;

  const mockPrisma = {
    customer: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCustomer,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DeleteCustomer>(DeleteCustomer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delete', () => {
    const id = '123';

    it('Must delete client when found', async () => {
      const petshopId = 'petshop-test-id';

      mockPrisma.customer.findUnique.mockResolvedValue({
        id,
        customer_name: 'joao',
        customer_pet: 'lele',
        petshopId: 'petshop-test-id',
      });

      mockPrisma.customer.delete.mockResolvedValue({
        id,
        customer_name: 'joao',
        customer_pet: 'lele',
        petshopId: 'petshop-test-id',
      });

      await service.delete(id, petshopId);

      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id, petshopId: 'petshop-test-id' },
      });

      expect(mockPrisma.customer.delete).toHaveBeenCalledWith({
        where: { id, petshopId: 'petshop-test-id' },
      });
    });

    it('Must throw ForbiddenException when client not found', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.delete('inexistente', 'petshopID'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
