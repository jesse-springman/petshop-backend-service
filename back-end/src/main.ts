import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? ['petshopbackendservice.vercel.app']
      : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET, POST, PATCH, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3001);
  console.log(`🚀 Server running on http://localhost:3001`);
}
bootstrap();
