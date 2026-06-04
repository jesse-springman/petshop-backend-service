import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { JwtPayload } from './type/jwtPayload';

interface RequestWithUser {
  user: JwtPayload;
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (request.user?.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Acesso restrito');
    }

    return true;
  }
}
