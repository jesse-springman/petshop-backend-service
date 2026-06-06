import { mockPrisma } from '../__mocks__/prisma.mock';
import { PostVehicle } from '../../src/vehicle/use-cases/vehicle-post';

describe('POST/vehicle', () => {
  let useCase: PostVehicle;
  const businessId = 'business-test-id';

  const dto = {
    brand: 'Toyota',
    model: 'Corolla',
    plate: 'ABC1D23',
    customerId: 'customer-1',
  };

  beforeEach(() => {
    useCase = new PostVehicle(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should create vehicle successfully', async () => {
    mockPrisma.vehicle.create.mockResolvedValue({
      id: 'vehicle-1',
      ...dto,
      businessId,
      createdAt: new Date(),
    });

    const result = await useCase.execute(dto, businessId);

    expect(mockPrisma.vehicle.create).toHaveBeenCalledWith({
      data: {
        brand: dto.brand,
        model: dto.model,
        plate: dto.plate ?? null,
        customerId: dto.customerId,
        businessId,
      },
    });

    expect(result).toHaveProperty('id', 'vehicle-1');
    expect(result).toHaveProperty('brand', 'Toyota');
  });

  it('should create vehicle without plate', async () => {
    const dtoWithoutPlate = {
      brand: 'Honda',
      model: 'Civic',
      customerId: 'customer-1',
    };

    mockPrisma.vehicle.create.mockResolvedValue({
      id: 'vehicle-2',
      ...dtoWithoutPlate,
      plate: null,
      businessId,
      createdAt: new Date(),
    });

    const result = await useCase.execute(dtoWithoutPlate, businessId);

    expect(result.plate).toBeNull();
  });

  it('should throw if prisma fails', async () => {
    mockPrisma.vehicle.create.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(dto, businessId)).rejects.toThrow(
      'Database error',
    );
  });
});
