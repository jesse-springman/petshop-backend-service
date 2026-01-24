import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

interface JwtPayload {
  username: string;
  sub: string;
}

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
  user?: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();

    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Voce precisa estar logado');
    }

    try {
      const payload: JwtPayload =
        await this.jwtService.verifyAsync<JwtPayload>(token);

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Sessão inválida ou expirada.');
    }
  }
}
