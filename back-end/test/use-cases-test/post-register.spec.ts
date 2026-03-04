jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

import { mockPrisma } from '../__mocks__/prisma.mock';
import { Register } from '../../src/use-cases/post-register';
import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('POST /register', () => {
  let register: Register;

  beforeEach(() => {
    register = new Register(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('should throw  ForbiddenException if not ADMIN', async () => {
    await expect(
      register.execute(
        { id: '1', role: 'USER' },
        { name: 'Joao', password: '123' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('Should crete UserProfissional with sucesslly', async () => {
    mockPrisma.user.create.mockResolvedValue({
      id: '2',
      name: 'gabi',
      role: 'USER',
    });

    const result = await register.execute(
      { id: '1', role: 'ADMIN' },
      { name: 'gabi', password: '123' },
    );

    expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
    expect(mockPrisma.user.create).toHaveBeenCalled();
    expect(result.name).toBe('gabi');
  });
});
