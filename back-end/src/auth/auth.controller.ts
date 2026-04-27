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
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create.employee';
import { Register } from '../use-cases/post-register';
import { Request } from 'express';
import { LoginDto } from './dto/login';
import { JwtPayload } from './type/jwtPayload';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';

interface AutenticateRequest extends Request {
  user: JwtPayload;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private register: Register,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Autentica o usuário e retorna um JWT. O token também é salvo em cookie HttpOnly.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        success: true,
        userName: 'joao.silva',
        role: 'ADMIN',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas.',
  })
  async login(
    @Body() body: LoginDto,
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

    return {
      access_token: token,
      success: true,
      userName: user.name,
      role: user.role,
    };
  }

  @Post('register')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo funcionário' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'funcionário criado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos no corpo da requisição.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticação ausente ou inválido.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Apenas ADMIN pode criar usuários.',
  })
  async registerUser(
    @Req() req: AutenticateRequest,
    @Body() body: CreateEmployeeDto,
  ) {
    try {
      const { sub, role } = req.user;
      return await this.register.execute({ id: sub, role }, body);
    } catch (error: any) {
      if (error.message === 'Apenas ADMIN pode criar usuários') {
        throw new ForbiddenException(error.message);
      }
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Perfil do usuário autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados do perfil retornados com sucesso.',
    schema: {
      example: {
        userId: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
        userName: 'joao.silva',
        role: 'USER',
        isAdmin: false,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token ausente, inválido ou usuário não encontrado.',
  })
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
  @ApiOperation({ summary: 'Encerrar sessão' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessão encerrada com sucesso.',
    schema: {
      example: { message: 'Sessão encerrada' },
    },
  })
  logout(@Res({ passthrough: true }) response: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    response.clearCookie('access_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Sessão encerrada' };
  }
}
