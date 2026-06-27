import { UpdateService } from '../../src/servicesOfBusiness/use-cases/update-service';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('UPDATE /services', () => {
  let useCase: UpdateService;
  const businessId = 'businessId';
  const serviceId = 'serviceId';

  const mockService = {
    id: serviceId,
    name: 'Banho',
    price: '40.00',
    active: true,
    createdAt: new Date('2025-01-01'),
    businessId,
  };

  beforeEach(() => {
    useCase = new UpdateService(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should update service name successfully', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);
    mockPrisma.service.update.mockResolvedValue({
      ...mockPrisma,
      name: 'novo-servico',
    });

    const result = await useCase.execute(
      serviceId,
      {
        name: 'novo-servico',
      },
      businessId,
    );

    expect(result.name).toBe('novo-servico');
    expect(mockPrisma.service.update).toHaveBeenCalledWith({
      where: { id: serviceId },
      data: { name: 'novo-servico' },
    });
  });

  it('should update service price successfully', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);
    mockPrisma.service.update.mockResolvedValue({
      ...mockService,
      price: '60.00',
    });

    const result = await useCase.execute(
      serviceId,
      { price: 60.0 },
      businessId,
    );

    expect(result.price).toBe('60.00');
    expect(mockPrisma.service.update).toHaveBeenCalledWith({
      where: { id: serviceId },
      data: { price: 60.0 },
    });
  });

  it('should deactivate service successfully', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);
    mockPrisma.service.update.mockResolvedValue({
      ...mockService,
      active: false,
    });

    const result = await useCase.execute(
      serviceId,
      { active: false },
      businessId,
    );

    expect(result.active).toBe(false);
    expect(mockPrisma.service.update).toHaveBeenCalledWith({
      where: { id: serviceId },
      data: { active: false },
    });
  });

  it('Should throw NotFoundExceotion when service does not exist', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute(serviceId, { name: 'll' }, businessId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when service belongs to another  business', async () => {
    mockPrisma.service.findUnique.mockResolvedValue({
      ...mockService,
      businessId: 'errado',
    });

    await expect(
      useCase.execute(serviceId, { name: 'll' }, businessId),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrisma.service.update).not.toHaveBeenCalledWith();
  });

  it('should igonre undefined fields in update', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);
    mockPrisma.service.update.mockResolvedValue({
      ...mockService,
      name: 'teste',
    });

    await useCase.execute(
      serviceId,
      { name: 'teste', price: undefined },
      businessId,
    );

    expect(mockPrisma.service.update).toHaveBeenCalledWith({
      where: { id: serviceId },
      data: { name: 'teste' },
    });
  });
});
