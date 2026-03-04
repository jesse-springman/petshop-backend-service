import { AuthService } from '../../src/auth/auth.service';
import { mockPrisma } from '../__mocks__/prisma.mock';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('Routine Authentication', () => {
  let createUser!: AuthService;

  beforeEach(() => {
    createUser = new AuthService(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('POST it should make login and recive data correct', async () => {
    const hash = await bcrypt.hash('123456', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'jesse',
      password: hash,
      role: 'ADMIN',
    });

    const result = await createUser.validateUser('jesse', '123456');

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { name: 'jesse' },
    });

    expect(result).toHaveProperty('id', '1');
    expect(result).toHaveProperty('role', 'ADMIN');
  });

  it('should throw UnauthorizedException when user not registred', async () => {
    const hash = await bcrypt.hash('12345', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'jesse',
      password: hash,
      role: 'ADMIN',
    });

    await expect(createUser.validateUser('gabi', hash)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when password wrong', async () => {
    const hash = await bcrypt.hash('senha', 10);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'jefin',
      password: hash,
      role: 'ADMIN',
    });

    expect(createUser.validateUser('jefin', 'kkkk')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
