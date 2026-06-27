import { BadRequestException } from '@nestjs/common';
import { CreateService } from '../../src/servicesOfBusiness/use-cases/post-service';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { equal } from 'assert';

describe('POST /service', () => {
  let useCase: CreateService;
  const businessId = 'businessId';

  const mockService = {
    id: 'service-uuid-1',
    name: 'Banho',
    price: '40.00',
    active: true,
    createdAt: new Date('2025-01-01'),
    businessId,
  };

  beforeEach(() => {
    useCase = new CreateService(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should create a service successfully', async () => {
    mockPrisma.service.findFirst.mockResolvedValue(null);
    mockPrisma.service.create.mockResolvedValue(mockService);

    const result = await useCase.execute(
      { name: 'Banho', price: 40.0 },
      businessId,
    );

    expect(result).toEqual(mockService);
    expect(mockPrisma.service.create).toHaveBeenCalledWith({
      data: {
        name: 'Banho',
        price: '40',
        businessId,
      },
    });
  });

  it('Should throw BadRequestException when service already exist', async () => {
    mockPrisma.service.findFirst.mockResolvedValue(mockService);

    await expect(
      useCase.execute({ name: 'Banho', price: 40.0 }, businessId),
    ).rejects.toThrow(BadRequestException);

    expect(mockPrisma.service.create).not.toHaveBeenCalled();
  });

  it('Should throw with correct message when service already exist', async () => {
    mockPrisma.service.findFirst.mockResolvedValue(mockService);

    const nameService = 'test';

    await expect(
      useCase.execute({ name: nameService, price: 40.0 }, businessId),
    ).rejects.toThrow(`Serviço "${nameService}" já esta cadastrado`);
  });

  it('Should check duplicate with case insensitive search', async () => {
    mockPrisma.service.findFirst.mockResolvedValue(null);
    mockPrisma.service.create.mockResolvedValue(mockService);

    await useCase.execute({ name: 'banho', price: 40.0 }, businessId);

    expect(mockPrisma.service.findFirst).toHaveBeenCalledWith({
      where: {
        name: { equals: 'banho', mode: 'insensitive' },
        businessId,
        active: true,
      },
    });
  });

  it('should convert price to string before saving', async () => {
    mockPrisma.service.findFirst.mockResolvedValue(null);
    mockPrisma.service.create.mockResolvedValue(mockService);

    await useCase.execute({ name: 'Banho', price: 40.0 }, businessId);

    expect(mockPrisma.service.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ price: '40' }),
      }),
    );
  });

  it('Should allow same service name for different busninesses', async () => {
    mockPrisma.service.findFirst.mockResolvedValue(null);
    mockPrisma.service.create.mockResolvedValue({
      ...mockService,
      businessId: 'business2',
    });

    const result = await useCase.execute(
      { name: 'Banho', price: 40.0 },
      'business2',
    );

    expect(result).toBeDefined();
    expect(mockPrisma.service.create).toHaveBeenCalledTimes(1);
  });
});
