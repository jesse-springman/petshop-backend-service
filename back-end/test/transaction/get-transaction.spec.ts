import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { GetTransaction } from '../../src/transaction/use-cases/get-transaction';

describe('GET /financeiro', () => {
  let useCase: GetTransaction;
  const businessId = 'business-test-id';

  const mockIncome = {
    id: 'income1',
    type: 'INCOME',
    amount: 80,
    createdAt: new Date('2024-06-10T10:00:00Z'),
    category: 'lucro',
    businessId,
    description: 'banho',
    appointmentId: {
      id: 'appointmentId',
      notes: null,
      customer: { name: 'joao' },
    },
  };

  const mockExpense = {
    id: 'expense1',
    type: 'EXPENSE',
    amount: 50,
    createdAt: new Date('2024-06-11T10:00:00Z'),
    businessId,
    description: 'anuncio',
    appointmentId: null,
  };

  beforeEach(() => {
    useCase = new GetTransaction(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should return all transaction and correct summary without filters', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([
      mockExpense,
      mockIncome,
    ]);

    const result = await useCase.execute(businessId, {});

    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          select: {
            id: true,
            notes: true,
            customer: { select: { name: true } },
          },
        },
      },
    });

    expect(result.transaction).toHaveLength(2);
    expect(result.summary).toEqual({
      income: 80,
      expense: 50,
      profit: 30,
      total: 2,
    });
  });

  it('should return empty only INCOME transaction with correct summary', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([mockIncome]);

    const result = await useCase.execute(businessId, {});

    expect(result.summary.income).toBe(80);
    expect(result.summary.expense).toBe(0);
    expect(result.summary.profit).toBe(80);
  });

  it('should return only EXPENSE transaction with negative profit', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([mockExpense]);

    const result = await useCase.execute(businessId, {});

    expect(result.summary.expense).toBe(50);
    expect(result.summary.income).toBe(0);
    expect(result.summary.profit).toBe(-50);
  });

  it('should filter by start date only', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([mockIncome]);

    const result = await useCase.execute(businessId, { start: '2024-06-01' });

    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          businessId,
          createdAt: { gte: new Date('2024-06-01') },
        },
      }),
    );

    expect(result.transaction).toHaveLength(1);
  });

  it('should filter by end date only', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([mockExpense]);

    await useCase.execute(businessId, { end: '2024-06-30' });

    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          businessId,
          createdAt: { lte: new Date('2024-06-30') },
        },
      }),
    );
  });

  it('should filter by start and end date', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([
      mockIncome,
      mockExpense,
    ]);

    await useCase.execute(businessId, {
      start: '2024-06-01',
      end: '2024-06-30',
    });

    expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          businessId,
          createdAt: {
            gte: new Date('2024-06-01'),
            lte: new Date('2024-06-30'),
          },
        },
      }),
    );
  });

  it('should throw BadRequestException for invalid star Date', async () => {
    await expect(useCase.execute(businessId, { start: 'kk' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for invalid end Date', async () => {
    await expect(useCase.execute(businessId, { end: 'kk' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException with correct message for invalid Date', async () => {
    await expect(useCase.execute(businessId, { start: 'kk' })).rejects.toThrow(
      'Intervalo de datas inválido',
    );
  });
});
