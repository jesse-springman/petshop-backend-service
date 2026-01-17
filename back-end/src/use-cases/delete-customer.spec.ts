import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCustomer } from './delete-customer';
import { PrismaService } from '../prisma/database/prisma.service';

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
      mockPrisma.customer.findUnique.mockResolvedValue({
        id,
        customer_name: 'joao',
        customer_pet: 'lele',
      });

      mockPrisma.customer.delete.mockResolvedValue({
        id,
        customer_name: 'joao',
        customer_pet: 'lele',
      });

      const result = await service.delete(id);

      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });

      expect(mockPrisma.customer.delete).toHaveBeenCalledWith({
        where: { id },
      });

      expect(result).toBe(true);
    });

    it('Must return false when o client not found', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      const result = await service.delete(id);

      expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });

      expect(mockPrisma.customer.delete).not.toHaveBeenCalled();

      expect(result).toBe(false);
    });

    it('Controller must return false', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);

      const result = await service.delete(id);

      expect(result).toBe(false);
      expect(mockPrisma.customer.delete).not.toHaveBeenCalledWith();
    });
  });
});
