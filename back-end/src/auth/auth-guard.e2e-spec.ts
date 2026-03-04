import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() } as unknown as JwtService;
    guard = new AuthGuard(jwtService);
  });

  it('it should throw erro if not have the cookie ACCESS_TOKEN', async () => {
    const mockRequest = {
      cookies: {},
    };

    const context = createMockContext(mockRequest);
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('it should allow access if the token is valid', async () => {
    const mockPayload = { username: 'admin', sub: '1' };

    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(mockPayload);

    const mockRequest = {
      cookies: { access_token: 'valid_token' },
      user: null,
    };

    const context = createMockContext(mockRequest);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockPayload);
  });
});

function createMockContext(request: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}
