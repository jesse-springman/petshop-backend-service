import { BadRequestException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { CreateTransaction } from '../../src/transaction/use-cases/post-transaction';
import { TransactionType } from '@prisma/client';

describe('POST /transaction', () => {
  let useCase: CreateTransaction;
  const businessId = 'businessId';

  const mockExpenseDto = {
    type: TransactionType.EXPENSE,
    amount: 150,
    description: 'compra shampoo',
    category: 'Produtos',
    appointmentsId: undefined,
  };

  const mockIncomeDto = {
    type: TransactionType.INCOME,
    amount: 150,
    description: 'Banho + Tosa',
    category: undefined,
    appointmentsId: 'apt1',
  };

  const mockCreatedTransaction = {
    id: 'tx1',
    businessId,
    ...mockExpenseDto,
    appointmentId: null,
    createdAt: new Date(),
  };

  beforeEach(() => {
    useCase = new CreateTransaction(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should create an EXPENSE transaction without appointmentId', async () => {
    mockPrisma.transaction.create.mockResolvedValue(mockCreatedTransaction);

    const result = await useCase.execute(mockExpenseDto, businessId);

    expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
      data: {
        type: mockExpenseDto.type,
        amount: mockExpenseDto.amount,
        category: mockExpenseDto.category,
        businessId,
        description: mockExpenseDto.description,
        appointmentId: undefined,
      },
    });

    expect(result).toHaveProperty('id', 'tx1');
  });

  it('should create an INCOME transaction with appointmentId', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);
    mockPrisma.transaction.create.mockResolvedValue({
      ...mockCreatedTransaction,
      type: TransactionType.INCOME,
      appointmentId: 'apt1',
    });

    await useCase.execute(mockIncomeDto, businessId);

    expect(mockPrisma.transaction.findUnique).toHaveBeenCalledWith({
      where: { appointmentId: 'apt1' },
    });

    expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
      data: {
        type: mockIncomeDto.type,
        amount: mockIncomeDto.amount,
        category: mockIncomeDto.category,
        description: mockIncomeDto.description,
        businessId,
        appointmentId: 'apt1',
      },
    });
  });

  it('should throw BadRequestException when a appointment already has a transaction', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx1',
      appointmentId: 'apt1',
    });

    await expect(useCase.execute(mockIncomeDto, businessId)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockPrisma.transaction.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException with correct message when appointment already has a  transaction', async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: 'tx1',
      appointmentId: 'apt1',
    });
    await expect(useCase.execute(mockIncomeDto, businessId)).rejects.toThrow(
      'Já existe uma transação vincula a este agendamento',
    );
  });

  it('should save description and category as separate fields', async () => {
    const dto = {
      type: TransactionType.EXPENSE,
      amount: 200,
      description: 'pagamento aluguel',
      category: 'Aluguel',
      appointmentId: undefined,
    };

    mockPrisma.transaction.create.mockResolvedValue({} as any);

    await useCase.execute(dto, businessId);

    const callData = mockPrisma.transaction.create.mock.calls[0][0].data;
    expect(callData.description).toBe('pagamento aluguel');
    expect(callData.category).toBe('Aluguel');

    expect(callData.description).not.toBe(callData.category);
  });
});
