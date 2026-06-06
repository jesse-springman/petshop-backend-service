import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { ServicesBusiness } from '../../src/superAdmin/admin.service';

describe('SuperAdmin - Business', () => {
  let useCase: ServicesBusiness;

  const mockBusiness = {
    id: 'business-1',
    name: 'Petshop da Ana',
    plan: 'BASIC',
    commerce: 'PETSHOP',
    status: 'PENDING',
    active: true,
    createdAt: new Date(),
    users: [{ name: 'ana' }],
  };

  beforeEach(() => {
    useCase = new ServicesBusiness(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should return all businesses', async () => {
    mockPrisma.business.findMany.mockResolvedValue([mockBusiness]);

    const result = await useCase.findAllBusiness();

    expect(mockPrisma.business.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('name', 'Petshop da Ana');
  });

  it('should return empty array when no businesses exist', async () => {
    mockPrisma.business.findMany.mockResolvedValue([]);

    const result = await useCase.findAllBusiness();

    expect(result).toHaveLength(0);
  });

  it('should update business status successfully', async () => {
    mockPrisma.business.findUnique.mockResolvedValue(mockBusiness);
    mockPrisma.business.update.mockResolvedValue({
      ...mockBusiness,
      status: 'ACTIVE',
    });

    const result = await useCase.updateStatus('business-1', {
      status: 'ACTIVE',
    });

    expect(mockPrisma.business.update).toHaveBeenCalledWith({
      where: { id: 'business-1' },
      data: { status: 'ACTIVE' },
    });

    expect(result).toHaveProperty('status', 'ACTIVE');
  });

  it('should throw NotFoundException when business does not exist', async () => {
    mockPrisma.business.findUnique.mockResolvedValue(null);

    await expect(
      useCase.updateStatus('id-invalido', { status: 'ACTIVE' }),
    ).rejects.toThrow(NotFoundException);
  });
});
