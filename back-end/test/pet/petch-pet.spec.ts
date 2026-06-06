import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { PatchPet } from '../../src/pet/use-cases/patch-pet';

describe('PATCH /pet/:id', () => {
  let useCase: PatchPet;

  const businessId = 'business-test-id';

  const mockPet = {
    id: 'pet-1',
    name: 'Rex',
    breed: 'Labrador',
    lastBath: new Date(),
    customerId: 'customer-1',
    businessId,
    createdAt: new Date(),
  };

  beforeEach(() => {
    useCase = new PatchPet(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should update pet successfully', async () => {
    mockPrisma.pet.findUnique.mockResolvedValue(mockPet);
    mockPrisma.pet.update.mockResolvedValue({ ...mockPet, name: 'Toby' });

    const result = await useCase.execute('pet-1', { name: 'Toby' }, businessId);

    expect(mockPrisma.pet.update).toHaveBeenCalledWith({
      where: { id: 'pet-1', businessId },
      data: {
        name: 'Toby',
        breed: undefined,
        lastBath: undefined,
      },
    });

    expect(result).toHaveProperty('name', 'Toby');
  });

  it('should throw NotFoundException when pet does not exist', async () => {
    mockPrisma.pet.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('id-invalido', { name: 'Toby' }, businessId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update lastBath correctly', async () => {
    mockPrisma.pet.findUnique.mockResolvedValue(mockPet);
    mockPrisma.pet.update.mockResolvedValue({
      ...mockPet,
      lastBath: new Date('2026-05-01T00:00:00.000Z'),
    });

    const result = await useCase.execute(
      'pet-1',
      { lastBath: '2026-05-01T00:00:00.000Z' },
      businessId,
    );

    expect(result.lastBath).toEqual(new Date('2026-05-01T00:00:00.000Z'));
  });
});
