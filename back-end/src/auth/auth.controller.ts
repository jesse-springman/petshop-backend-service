import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { AuthGuard } from './auth.guard';
import {
  Controller,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/create.user';
import { Role } from '@prisma/client';
import { Register } from '../use-cases/post-register';
import { Request } from 'express';

interface JwtPayload {
  username: string;
  sub: string;
  role: Role;
}

interface AutenticateRequest extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private register: Register,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.name, body.password);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.name,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    const isProd = process.env.NODE_ENV === 'production';

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return { success: true, userName: user.name, role: user.role };
  }

  @UseGuards(AuthGuard)
  @Post('register')
  async registerUser(
    @Req() req: AutenticateRequest,
    @Body() body: RegisterDto,
  ) {
    const { sub, role } = req.user;
    return await this.register.execute({ id: sub, role }, body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: AutenticateRequest) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autorizado');
    }

    return {
      userId: req.user.sub,
      userName: req.user.username,
      role: req.user.role,
      isAdmin: req.user.role === 'ADMIN',
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
    });
    return { message: 'Sessão encerrada' };
  }
}
