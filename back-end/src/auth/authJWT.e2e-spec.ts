import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../app.module';
import { JwtPayload } from './auth.guard';
import { PrismaService } from '../prisma/database/prisma.service';
import * as bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

describe('JWT Tests', () => {
  let app: INestApplication;
  let server: Server;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();

    server = app.getHttpServer() as Server;

    prisma = app.get(PrismaService);

    await prisma.user.create({
      data: {
        name: 'jesse',
        password: await bcrypt.hash('kkkk', 10),
        role: 'ADMIN',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should set cookie with valid JWT token', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({ name: 'jesse', password: 'kkkk' });

    expect(response.status).toBe(200);

    const cookie = response.get('Set-Cookie');
    expect(cookie).toBeDefined();

    if (!cookie) {
      throw new Error('Cookie not found');
    }

    expect(cookie[0]).toContain('access_token=');

    const token = cookie[0].split(';')[0].replace('access_token=', '');

    const jwtService = app.get(JwtService);
    const decoded = jwtService.verify<JwtPayload>(token);

    expect(decoded).toHaveProperty('sub');
    expect(decoded).toHaveProperty('username');
    expect(decoded).toHaveProperty('role');
  });

  it('should access protected route with valid cookie', async () => {
    const agent = request.agent(server);

    const loginResponse = await agent
      .post('/auth/login')
      .send({ name: 'jesse', password: 'kkkk' });

    console.log(loginResponse.body);

    expect(loginResponse.status).toBe(200);

    const profileResponse = await agent.get('/auth/me');

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('userName');
  });

  it('should deny access with invalid cookie', async () => {
    const response = await request(server)
      .get('/auth/me')
      .set('Cookie', ['access_token=token-falso']);

    expect(response.status).toBe(401);
  });

  it('should clear cookie on logout', async () => {
    const response = await request(server).post('/auth/logout');
    const cookie = response.get('Set-Cookie');

    if (!cookie) {
      throw new Error('Cookie not found');
    }
    expect(cookie[0]).toContain('access_token=;');
  });
});
