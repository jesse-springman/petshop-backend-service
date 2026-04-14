import { JwtPayload } from './jwtPayload';

export interface AuthRequest {
  user: JwtPayload;
}
