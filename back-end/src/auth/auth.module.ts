import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/database/prisma.service';
import { Register } from '../use-cases/post-register';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PrismaService, Register],
  exports: [AuthService],
})
export class AuthModule {}
