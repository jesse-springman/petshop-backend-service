import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { GetPet } from '../../src/pet/use-cases/get-pet';

describe('GET/pet', () => {
  let useCase: GetPet;
  const businessId = 'business-test-id';

  const mockPet = {
    id: 'pet1',
    name: 'Rex',
    breed: 'Labrador',
    lastBath: new Date(),
    customerId: 'customer-1',
    businessId,
    createdAt: new Date(),
  };

  beforeEach(() => {
    useCase = new GetPet(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should return all pets of a customer', async () => {
    mockPrisma.pet.findMany.mockResolvedValue([mockPet]);

    const result = await useCase.findAllByCustomer('customer1', businessId);
    expect(mockPrisma.pet.findMany).toHaveBeenCalledWith({
      where: { customerId: 'customer1', businessId },
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('name', 'Rex');
  });

  it('should return empty array when customer has no pets', async () => {
    mockPrisma.pet.findMany.mockResolvedValue([]);

    const result = await useCase.findAllByCustomer('customer1', businessId);

    expect(result).toHaveLength(0);
  });

  it('should return pet by id', async () => {
    mockPrisma.pet.findUnique.mockResolvedValue(mockPet);

    const result = await useCase.findOne('pet1', businessId);

    expect(mockPrisma.pet.findUnique).toHaveBeenCalledWith({
      where: { id: 'pet1', businessId },
    });

    expect(result).toHaveProperty('id', 'pet1');
  });

  it('should throw NotFoundException when pet does not exist', async () => {
    mockPrisma.pet.findUnique.mockResolvedValue(null);
    await expect(useCase.findOne('id-invalido', businessId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
