import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import cookieParser from 'cookie-parser';

type LoginResponse = {
  success: boolean;
  message: string;
};

describe('Routine Authentication', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.resetModules();

    const moduleTest: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleTest.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('POST it should make login and recive data correct', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const server = app.getHttpServer();

    const response = await request(server)
      .post('/')
      .send({ nameClient: 'jesse' });

    expect(response.status).toBe(200);
    expect(response.get('Set-Cookie')?.[0]).toContain('access_token');

    const body = response.body as LoginResponse;
    expect(body.success).toBe(true);
  });

  it('it should fail when user be invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({ nameClient: 'inexisteente' });

    expect(response.status).toBe(401);
    expect(response.get('Set-Cookie')).toBeUndefined();

    const body = response.body as LoginResponse;
    expect(body.message).toBe('Acesso não autorizado');
  });

  it('it should to deny access without token', async () => {
    const response = await request(app.getHttpServer()).get('/auth/me');

    expect(response.status).toBe(401);
  });

  it('It should to deny when token invalid', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', ['access_token= token_falso']);

    expect(response.status).toBe(401);
  });

  it('it should to deny when token has expired', async () => {
    const expiredToken = 'token_expirado_falso';

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', [`access_token=${expiredToken}`]);
    expect(response.status).toBe(401);
  });
});
