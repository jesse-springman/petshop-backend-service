import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/database/prisma.service';
import { Register } from '../use-cases/post-register';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, AuthGuard, PrismaService, Register],
  exports: [AuthService],
})
export class AuthModule {}
