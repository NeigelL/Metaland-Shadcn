import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|sw.js).*)'],
};

export function middleware(request: NextRequest) {
 const host = request.headers.get('host');
 const { pathname } = request.nextUrl

  // if (pathname.startsWith("/api/auth")) {
  //   return NextResponse.next()
  // }

  // if (host?.includes(process.env.NEXT_BUYER_DOMAIN || 'buyer.metaland.properties')) {
  //   return NextResponse.rewrite(new URL(`/buyer${request.nextUrl.pathname}`, request.url));
  // }

  // if (host?.includes(process.env.NEXT_ADMIN_DOMAIN || 'app.metaland.properties')) {
  //   return NextResponse.rewrite(new URL(`/admin${request.nextUrl.pathname}`, request.url));
  // }

  //   if (host?.includes(process.env.NEXT_AGENT_DOMAIN || 'agent.metaland.properties')) {
  //   return NextResponse.rewrite(new URL(`/agent${request.nextUrl.pathname}`, request.url));
  // }

  return NextResponse.next(); // fallback
}
