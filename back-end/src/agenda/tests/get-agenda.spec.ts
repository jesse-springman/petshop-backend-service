import { BadRequestException } from '@nestjs/common';
import { GetAgenda } from '../use-cases/get-agenda';
import { mockPrisma } from '../../__mocks__/prisma.mock';
import { Appointment } from '@prisma/client';
import { dtoAppointments } from '../use-cases/get-agenda';
import { Prisma } from '@prisma/client';

describe('GET /agenda', () => {
  let useCase: GetAgenda;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetAgenda(mockPrisma as any);
  });

  it('it should throw BadRequestException whan format is invalid', async () => {
    const userId = '123';
    const query = { start: 'data-errada', end: '2026-02-12' };

    await expect(useCase.execute(userId, query)).rejects.toThrow(
      BadRequestException,
    );

    //confirma q o banco nao foi consultado
    expect(mockPrisma.appointment.findMany).not.toHaveBeenCalled();
  });

  it('it should retorn list empty if dont have scheduling', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([]);

    const result = await useCase.execute('user1', {
      start: '2026-01-01',
      end: '2026-01-02',
    });

    expect(result.length).toBe(0);
  });

  it('should seach scheduling', async () => {
    const userId = 'user2';
    const query: dtoAppointments = { start: '2026-02-13', end: '2026-03-12' };

    const appointments: Appointment[] = [];

    mockPrisma.appointment.findMany.mockResolvedValue(appointments);

    await useCase.execute(userId, query);

    const spy = mockPrisma.appointment.findMany;

    expect(spy).toHaveBeenCalled();

    const calls = spy.mock.calls as [Prisma.AppointmentFindManyArgs][];
    const args = calls[0][0];
    if (
      !args.where ||
      typeof args.where.date !== 'object' ||
      args.where.date === null
    ) {
      throw new Error('Filtro de data inválido');
    }

    if (!('gte' in args.where.date) || !('lt' in args.where.date)) {
      throw new Error('Filtro não contém gte e lt');
    }
    const dateFilter = args.where?.date;

    if (
      dateFilter &&
      typeof dateFilter === 'object' &&
      'gte' in dateFilter &&
      'lt' in dateFilter
    )
      expect(args.where.userId).toBe(userId);
    expect(dateFilter.gte).toBeInstanceOf(Date);
    expect(dateFilter.lt).toBeInstanceOf(Date);
  });
});
