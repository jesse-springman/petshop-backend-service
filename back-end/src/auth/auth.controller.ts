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
import { CreateUserTdo } from './dto/create.user';
import { Roles } from '@prisma/client';

interface JwtPayload {
  username: string;
  sub: string;
  role: Roles;
}

interface AutenticateRequest extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: CreateUserTdo,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.name, body.password);

    const payload: JwtPayload = {
      sub: user.id,
      username: user.name,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return { success: true, userName: user.name, role: user.role };
  }

  @Post('register')
  @UseGuards(AuthGuard)
  async registerUser(
    @Req() req: AutenticateRequest,
    @Body() body: CreateUserTdo,
  ) {
    const { sub, role } = req.user;
    return await this.authService.register({ id: sub, role }, body);
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
