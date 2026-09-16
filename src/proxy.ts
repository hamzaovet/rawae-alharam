import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || "super-secret-key-rawaee";
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isLogin = request.nextUrl.pathname === '/login';

  let isAuthenticated = false;
  if (session) {
    try {
      await jwtVerify(session, key, { algorithms: ["HS256"] });
      isAuthenticated = true;
    } catch (e) {
      // Invalid token
    }
  }

  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLogin && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
