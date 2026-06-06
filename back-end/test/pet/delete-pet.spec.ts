import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { DeletePet } from '../../src/pet/use-cases/delete-pet';

describe('DELETE /pet/:id', () => {
  let useCase: DeletePet;

  const businessId = 'business-test-id';

  const mockPet = {
    id: 'pet-1',
    name: 'Rex',
    businessId,
  };

  beforeEach(() => {
    useCase = new DeletePet(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should delete pet successfully', async () => {
    mockPrisma.pet.findUnique.mockResolvedValue(mockPet);
    mockPrisma.pet.delete.mockResolvedValue(undefined);

    await useCase.execute('pet-1', businessId);

    expect(mockPrisma.pet.delete).toHaveBeenCalledWith({
      where: { id: 'pet-1' },
    });
  });

  it('should throw NotFoundException when pet does not exist', async () => {
    mockPrisma.pet.findUnique.mockResolvedValue(null);

    await expect(useCase.execute('id-invalido', businessId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
