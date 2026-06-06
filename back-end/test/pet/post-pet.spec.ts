import { NotFoundException } from '@nestjs/common';
import { PostPet } from '../../src/pet/use-cases/post-pet';
import { mockPrisma } from '../__mocks__/prisma.mock';

describe('POST /pet', () => {
  let useCase: PostPet;
  const businessId = 'business-test-id';

  const dto = {
    name: 'Rex',
    breed: 'Labrador',
    customerId: 'customer-1',
    lastBath: '2026-03-22T00:00:00.000Z',
  };

  beforeEach(() => {
    useCase = new PostPet(mockPrisma as any);
    jest.clearAllMocks;
  });

  it('should create pet successfully', async () => {
    mockPrisma.pet.create.mockResolvedValue({
      id: 'pet-1',
      name: dto.name,
      breed: dto.breed,
      customerId: dto.customerId,
      businessId,
      lastBath: new Date(dto.lastBath),
      createdAt: new Date(),
    });
    const result = await useCase.execute(dto, businessId);

    await expect(result).toHaveProperty('id', 'pet-1');
    await expect(result).toHaveProperty('name', 'Rex');
  });

  it('should create pet without optional fields', async () => {
    const minimalDto = { name: 'Toby', customerId: 'customer-1' };

    mockPrisma.pet.create.mockResolvedValue({
      id: 'pet-2',
      name: 'Toby',
      breed: null,
      lastBath: null,
      customerId: 'customer-1',
      businessId,
      createdAt: new Date(),
    });

    const result = await useCase.execute(minimalDto, businessId);

    expect(result).toHaveProperty('id', 'pet-2');
    expect(result.breed).toBeNull();
  });

  it('should throw if prisma fails', async () => {
    mockPrisma.pet.create.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(dto, businessId)).rejects.toThrow(
      'Database error',
    );
  });
});
