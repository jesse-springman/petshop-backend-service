import { JwtPayload } from './jwtPayLoad';

export interface AuthRequest {
  user: JwtPayload;
}
