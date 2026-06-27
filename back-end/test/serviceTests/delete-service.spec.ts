import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { DeleteService } from '../../src/servicesOfBusiness/use-cases/delete-service';

describe('DELETE /services/:id', () => {
  let useCase: DeleteService;

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
    useCase = new DeleteService(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('Should deleter service with successfully', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);
    mockPrisma.service.update.mockResolvedValue({
      ...mockService,
      active: false,
    });

    const result = await useCase.execute(serviceId, businessId);

    expect(result.active).toBe(false);

    expect(mockPrisma.service.update).toHaveBeenCalledWith({
      where: { id: serviceId },
      data: { active: false },
    });
  });

  it('Should throw NotFoundException when service  does not exist', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(null);

    await expect(useCase.execute(serviceId, businessId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockPrisma.service.update).not.toHaveBeenCalled();
  });

  it('Should throw with messgae correct when service does not exist', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(null);

    await expect(useCase.execute(serviceId, businessId)).rejects.toThrow(
      'Serviço não encontrado',
    );
  });

  it('should throw ForbiddenException when service belongs to another business', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);

    await expect(useCase.execute(serviceId, 'idbusinessFalse')).rejects.toThrow(
      ForbiddenException,
    );

    expect(mockPrisma.service.update).not.toHaveBeenCalled();
  });

  it('should throw with correct message when business has no permission', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);

    await expect(useCase.execute(serviceId, 'fakeBusiness')).rejects.toThrow(
      'Você não tem permissão para deletar esse serviço',
    );
  });

  it('should not delete the record only deactivate', async () => {
    mockPrisma.service.findUnique.mockResolvedValue(mockService);
    mockPrisma.service.update.mockResolvedValue({
      ...mockService,
      active: false,
    });

    await useCase.execute(serviceId, businessId);

    expect(mockPrisma.service.delete).not.toHaveBeenCalled();
    expect(mockPrisma.service.update).toHaveBeenCalled();
  });
});
