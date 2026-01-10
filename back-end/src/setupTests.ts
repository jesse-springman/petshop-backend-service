jest.mock('./prisma/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    customer: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));
