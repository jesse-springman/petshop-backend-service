import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/database/prisma.service';
import { mockPrisma } from '../__mocks__/prisma.mock';

describe('GET /customers (com Prisma mockado)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    mockPrisma.customer.findMany.mockResolvedValue([
      { id: 1, customer_name: 'Jesse', pet_name: 'Cacau' },
    ]);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve retornar um array de customers', async () => {
    const response = await request(app.getHttpServer())
      .get('/clientes')
      .expect(200);

    expect(response.body).toEqual([
      { id: 1, customer_name: 'Jesse', pet_name: 'Cacau' },
    ]);

    expect(mockPrisma.customer.findMany).toHaveBeenCalledTimes(1);
  });
});
