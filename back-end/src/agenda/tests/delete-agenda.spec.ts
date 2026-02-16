import { DeleteScheduling } from '../use-cases/delete-agenda';
import { mockPrisma } from '../../__mocks__/prisma.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('DELETE /agenda', () => {
  let deleteScheduling!: DeleteScheduling;

  beforeEach(() => {
    deleteScheduling = new DeleteScheduling(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should delete SCHEDULING', async () => {
    const userId = 'user1';
    const agendaId = 'agenda1';

    const agenda = {
      id: agendaId,
      userId,
      status: 'SCHEDULING',
    };

    mockPrisma.appointment.findUnique.mockResolvedValue(agenda);

    mockPrisma.appointment.delete.mockResolvedValue({ id: agenda.id });

    const result = await deleteScheduling.execute(agenda.userId, agenda.id);

    expect(mockPrisma.appointment.findUnique).toHaveBeenCalledWith({
      where: { id: agenda.id },
    });

    expect(mockPrisma.appointment.delete).toHaveBeenCalledWith({
      where: { id: agenda.id },
    });

    expect(result).toEqual({
      message: 'Agendamento deletado com sucesso',
    });
  });

  it('should throw NotFoundException when scheduling not exist', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null);

    await expect(
      deleteScheduling.execute('user1', 'notExist'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw ForbiddenException when a user try delete scheduling of other user', async () => {
    const agendaObj = {
      userId: 'user1',
      agendaId: 'agenda1',
      status: 'SCHEDULING',
    };

    mockPrisma.appointment.findUnique.mockResolvedValue(agendaObj);

    await expect(
      deleteScheduling.execute('user2', agendaObj.agendaId),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
