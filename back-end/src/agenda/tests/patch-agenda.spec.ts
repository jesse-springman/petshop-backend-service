import { UpdateAgenda } from '../use-cases/patch-agenda';
import { mockPrisma } from '../../__mocks__/prisma.mock';

import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PATCH / agenda', () => {
  let updateAgenda!: UpdateAgenda;

  beforeEach(() => {
    updateAgenda = new UpdateAgenda(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should update status sucessfully', async () => {
    const userId = 'user1';
    const agendaId = 'agenda1';

    const extingAgenda = {
      id: agendaId,
      userId,
      status: 'SCHEDULED',
    };

    mockPrisma.appointment.findUnique.mockResolvedValue(extingAgenda);

    mockPrisma.appointment.update.mockResolvedValue({
      ...extingAgenda,
      status: 'COMPLETED',
    });

    const result = await updateAgenda.execute(userId, agendaId, {
      status: 'COMPLETED',
    });

    expect(mockPrisma.appointment.findUnique).toHaveBeenCalledWith({
      where: { id: agendaId },
    });

    expect(mockPrisma.appointment.update).toHaveBeenCalledWith({
      where: { id: agendaId },
      data: {
        status: 'COMPLETED',
      },
    });

    expect(result.status).toBe('COMPLETED');
  });

  it('should throw NotFoundException if agenda does not exist', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null);

    await expect(
      updateAgenda.execute('user1', 'agenda1', {
        status: 'COMPLETED',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw ForbiddenExpection whan user try change another agenda', async () => {
    const user1 = 'user1';
    const agenda = 'agenda1';

    mockPrisma.user.findUnique.mockResolvedValue(user1);
    mockPrisma.appointment.findUnique.mockResolvedValue(agenda);

    await expect(
      updateAgenda.execute('userFalse', 'agenda1', {
        status: 'COMPLETED',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
