import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { DeleteTransaction } from '../../src/transaction/use-cases/delete-transaction';
import { mock } from 'node:test';

describe('DELETE /transaction', () => {
  let useCase: DeleteTransaction;
  const businessId = 'id';

  const mockTransaction = {
    id: 'tx1',
    businessId,
    appointmentId: null,
    amount: 150,
    description: 'Shampoo',
    category: 'Produtos',
    createdAt: new Date(),
  };

  beforeEach(() => {
    useCase = new DeleteTransaction(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should Delete  a transaction successfully', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(mockTransaction);
    mockPrisma.transaction.delete.mockResolvedValue(mockTransaction);

    const result = await useCase.execute('tx1', businessId);

    expect(mockPrisma.transaction.delete).toHaveBeenCalledWith({
      where: { id: 'tx1' },
    });

    expect(result).toHaveProperty('id', 'tx1');
  });

  it('should throw NotFoundExpection when a transaction does not exist', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);

    await expect(useCase.execute('id', businessId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockPrisma.transaction.delete).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException with correct message', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue(null);

    await expect(useCase.execute('id', businessId)).rejects.toThrow(
      'Transação não encontrada',
    );
  });

  it('should throw ForbiddenException when transaction belongs to another business', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      ...mockTransaction,
      businessId: 'outro-businessId',
    });

    await expect(useCase.execute('tx1', businessId)).rejects.toThrow(
      ForbiddenException,
    );

    expect(mockPrisma.transaction.delete).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException with correct message when business does not match', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      ...mockTransaction,
      businessId: 'outro-businessId',
    });

    await expect(useCase.execute('tx1', businessId)).rejects.toThrow(
      'Você não tem permissão para excluir esta transação',
    );
  });

  it('should throw ForbiddenException when transaction  is linked  to an appointment', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      ...mockTransaction,
      appointmentId: 'apt-id',
    });

    await expect(useCase.execute('tx1', businessId)).rejects.toThrow(
      ForbiddenException,
    );

    expect(mockPrisma.transaction.delete).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException with correct message when transaction is linked to an appointment', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      ...mockTransaction,
      appointmentId: 'apt-1',
    });

    await expect(useCase.execute('tx-1', businessId)).rejects.toThrow(
      'Transações geradas automaticamente por agendamentos não podem ser excluídas',
    );
  });

  it('should check not found before forbidden', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('id-invalido', 'outro-businessId'),
    ).rejects.toThrow(NotFoundException);
  });
});
