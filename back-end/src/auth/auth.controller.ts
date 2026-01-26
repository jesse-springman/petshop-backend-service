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

interface JwtPayload {
  username: string;
  sub: string;
  role?: string;
}

interface AutenticateRequest extends Response {
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
  login(
    @Body() body: { nameClient: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = this.authService.validateAdmin(body.nameClient);

    const paylaod: JwtPayload = {
      sub: user.username,
      username: user.username,
      role: user.role,
    };

    const token = this.jwtService.sign(paylaod);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return { success: true, userName: user.username };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: AutenticateRequest) {
    if (!req.user) {
      throw new UnauthorizedException('Usuário não autorizado');
    }

    return {
      userName: req.user.username,
      isAdmin: req.user.role === 'admin',
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
