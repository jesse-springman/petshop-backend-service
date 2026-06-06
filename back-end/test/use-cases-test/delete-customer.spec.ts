import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCustomer } from '../../src/customer/use-cases/delete-customer';
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
      const businessId = 'business-test-id';

      mockPrisma.customer.findUnique.mockResolvedValue({
        id,
        customer_name: 'joao',
        customer_pet: 'lele',
        businessId: 'business-test-id',
      });

      mockPrisma.customer.delete.mockResolvedValue({
        id,
        customer_name: 'joao',
        customer_pet: 'lele',
        businessId: 'business-test-id',
      });

      await service.delete(id, businessId);

      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id, businessId: 'business-test-id' },
      });

      expect(mockPrisma.customer.delete).toHaveBeenCalledWith({
        where: { id, businessId: 'business-test-id' },
      });
    });

    it('Must throw ForbiddenException when client not found', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.delete('inexistente', 'businessID'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
