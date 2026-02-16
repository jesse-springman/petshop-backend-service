export const mockPrisma = {
  customer: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  },

  appointment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },

  user: {
    findUnique: jest.fn(),
  },
};
