import { DeleteScheduling } from '../../src/agenda/use-cases/delete-agenda';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('DELETE /agenda', () => {
  let deleteScheduling!: DeleteScheduling;

  beforeEach(() => {
    deleteScheduling = new DeleteScheduling(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should DELETE scheduling', async () => {
    const userId = 'user1';
    const agendaId = 'agenda1';
    const businessId = 'business-test-id';

    const agenda = {
      id: agendaId,
      userId,
      status: 'SCHEDULING',
    };

    mockPrisma.appointment.findUnique.mockResolvedValue(agenda);

    mockPrisma.appointment.delete.mockResolvedValue({ id: agenda.id });

    const result = await deleteScheduling.execute(
      agenda.userId,
      agenda.id,
      businessId,
    );

    expect(mockPrisma.appointment.findUnique).toHaveBeenCalledWith({
      where: { id: agenda.id },
    });

    expect(mockPrisma.appointment.delete).toHaveBeenCalledWith({
      where: { id: agenda.id, businessId: 'business-test-id' },
    });

    expect(result).toEqual({
      message: 'Agendamento deletado com sucesso',
    });
  });

  it('should throw NotFoundException when scheduling not exist', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null);

    await expect(
      deleteScheduling.execute('user1', 'notExist', 'businessId'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw ForbiddenException when a user try delete scheduling of other user', async () => {
    const businessId = 'petshop-test-id';
    const agendaObj = {
      userId: 'user1',
      agendaId: 'agenda1',
      status: 'SCHEDULING',
    };

    mockPrisma.appointment.findUnique.mockResolvedValue(agendaObj);

    await expect(
      deleteScheduling.execute('user2', agendaObj.agendaId, businessId),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
