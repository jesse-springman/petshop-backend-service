import { mockPrisma } from '../__mocks__/prisma.mock';
import { GetVehicle } from '../../src/vehicle/use-cases/vehicle-get';
import { NotFoundException } from '@nestjs/common';

describe('GET /vehicle', () => {
  let useCase: GetVehicle;

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

  beforeAll(() => {
    useCase = new GetVehicle(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should return all vehicles of a customer', async () => {
    mockPrisma.vehicle.findMany.mockResolvedValue([mockVehicle]);

    const result = await useCase.findAllByCustomer('customer-1', businessId);

    expect(mockPrisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { customerId: 'customer-1', businessId },
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('brand', 'Toyota');
  });

  it('should return empty array when customer has no vehicles', async () => {
    mockPrisma.vehicle.findMany.mockResolvedValue([]);

    const result = await useCase.findAllByCustomer('customer-1', businessId);

    expect(result).toHaveLength(0);
  });

  it('should return vehicle by id', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

    const result = await useCase.findOne('vehicle-1', businessId);

    expect(mockPrisma.vehicle.findUnique).toHaveBeenCalledWith({
      where: { id: 'vehicle-1', businessId },
    });

    expect(result).toHaveProperty('id', 'vehicle-1');
  });

  it('should throw NotFoundException when vehicle does not exist', async () => {
    mockPrisma.vehicle.findUnique.mockResolvedValue(null);

    await expect(useCase.findOne('id-invalido', businessId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
