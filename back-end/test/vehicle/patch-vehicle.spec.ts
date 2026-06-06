import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { PatchVehicle } from '../../src/vehicle/use-cases/vehicle-patch';

describe('PATCH /vehicle/:id', () => {
  let useCase: PatchVehicle;

  const businessId = 'business-test-id';

  const mockVehicle = {
    id: 'vehicle-1',
    brand: 'Toyota',
    model: 'Corolla',
    plate: 'ABC1D23',
    customerId: 'customer-1',
    businessId,
    createdAt: new Date(),
  };

  beforeEach(() => {
    useCase = new PatchVehicle(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should update vehicle successfully', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
    mockPrisma.vehicle.update.mockResolvedValue({
      ...mockVehicle,
      plate: 'XYZ9W99',
    });

    const result = await useCase.execute(
      'vehicle-1',
      { plate: 'XYZ9W99' },
      businessId,
    );

    expect(mockPrisma.vehicle.update).toHaveBeenCalledWith({
      where: { id: 'vehicle-1', businessId },
      data: {
        brand: undefined,
        model: undefined,
        plate: 'XYZ9W99',
      },
    });

    expect(result).toHaveProperty('plate', 'XYZ9W99');
  });

  it('should throw NotFoundException when vehicle does not exist', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('id-invalido', { brand: 'Honda' }, businessId),
    ).rejects.toThrow(NotFoundException);
  });
});
