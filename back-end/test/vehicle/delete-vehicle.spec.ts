import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { DeleteVehicle } from '../../src/vehicle/use-cases/vehicle-delete';

describe('DELETE /vehicle/:id', () => {
  let useCase: DeleteVehicle;

  const businessId = 'business-test-id';

  const mockVehicle = {
    id: 'vehicle-1',
    brand: 'Toyota',
    model: 'Corolla',
    businessId,
  };

  beforeEach(() => {
    useCase = new DeleteVehicle(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should delete vehicle successfully', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
    mockPrisma.vehicle.delete.mockResolvedValue(undefined);

    await useCase.execute('vehicle-1', businessId);

    expect(mockPrisma.vehicle.delete).toHaveBeenCalledWith({
      where: { id: 'vehicle-1' },
    });
  });

  it('should throw NotFoundException when vehicle does not exist', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(null);

    await expect(useCase.execute('id-invalido', businessId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
