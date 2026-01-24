import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  const { pathname } = request.nextUrl;

  const protectedRouter =
    pathname.startsWith('/cadastro') || pathname.startsWith('/clientes');

  if (protectedRouter && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/cadastro/:path*', '/clientes/:path*'] }; //matcher ajuda o Next saber quais rotas deve rodar o codigo
