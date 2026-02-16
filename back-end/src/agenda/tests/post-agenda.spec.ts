import { ConflictException, NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../../__mocks__/prisma.mock';
import { CreateAgenda } from '../use-cases/post-agenda';
import { Prisma } from '@prisma/client';

describe('POST at /agenda', () => {
  let createAgenda!: CreateAgenda;

  beforeEach(() => {
    createAgenda = new CreateAgenda(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should create appointment sucessfully', async () => {
    const userId = 'userId1';

    const dto = {
      customerId: 'customer1',
      date: '2026-03-10T14:00:00.000Z',
      status: 'SCHEDULED',
    };

    mockPrisma.customer.findUnique.mockResolvedValue({
      id: 'custoemer1',
    });

    mockPrisma.appointment.create.mockResolvedValue({
      id: 'appointment1',
      customerId: 'customer1',
      date: new Date(dto.date),
      userId,
    });

    const result = await createAgenda.execute(userId, dto);

    expect(mockPrisma.customer.findUnique).toHaveBeenCalledWith({
      where: { id: 'customer1' },
    });

    expect(mockPrisma.appointment.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'appointment1');
  });

  it('should throw if customer does not exist', async () => {
    mockPrisma.customer.findUnique.mockResolvedValue(null);

    await expect(
      createAgenda.execute('user1', {
        customerId: 'kkjjk',
        date: '2026-03-10T14:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw if date already exist for same professional', async () => {
    mockPrisma.customer.findUnique.mockRejectedValue({
      id: 'customer1',
    });
    mockPrisma.appointment.findUnique.mockResolvedValue({
      id: 'existing',
    });

    await expect(
      createAgenda.execute('user1', {
        customerId: 'customer1',
        date: '2çlçl',
      }),
    ).rejects.toThrow('Data inválida');
  });

  it('should throw conflict error if appointment already exist', async () => {
    const userId = 'user1';

    const dto = {
      customerId: 'customer1',
      date: '2026-03-10T14:00:00.000Z',
    };

    mockPrisma.customer.findUnique.mockResolvedValue({
      id: 'customer1',
    });

    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint falied',
      { code: 'P2002', clientVersion: '5.0.0' },
    );

    mockPrisma.appointment.create.mockRejectedValue(prismaError);

    await expect(createAgenda.execute(userId, dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('should throw unexpected error if prisma fails', async () => {
    const userId = 'user1';
    const dto = {
      customerId: 'customer1',
      date: '2026-03-10T14:00:00.000Z',
    };

    mockPrisma.customer.findUnique.mockResolvedValue({
      id: 'customer1',
    });

    mockPrisma.appointment.create.mockRejectedValue(
      new Error('Database crashed'),
    );

    await expect(createAgenda.execute(userId, dto)).rejects.toThrow(
      'Database crashed',
    );
  });
});
