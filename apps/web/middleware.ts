import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|sw.js).*)'],
};

const PUBLIC_FILE = /\.(.*)$/i

export function middleware(request: NextRequest) {
 const host = request.headers.get('host');
 const url = request.nextUrl.clone()


  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith('/_next') ||
    // url.pathname.startsWith('/api') || // allow API routes like /api/auth/*
    url.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  if (host?.includes(process.env.NEXT_BUYER_DOMAIN || 'buyer.metaland.properties')) {
    let response = NextResponse.rewrite(new URL(`/buyer${request.nextUrl.pathname}`, request.url))
       const cookies = request.cookies.getAll()
      for (const cookie of cookies) {
        response.cookies.set(cookie.name, cookie.value)
      }
    return response ;
  }

  if (host?.includes(process.env.NEXT_ADMIN_DOMAIN || 'app.metaland.properties')) {
      let response = NextResponse.rewrite(new URL(`/admin${request.nextUrl.pathname}`, request.url));
      const cookies = request.cookies.getAll()
      for (const cookie of cookies) {
        response.cookies.set(cookie.name, cookie.value)
      }
    return response ;
  }

    if (host?.includes(process.env.NEXT_AGENT_DOMAIN || 'agent.metaland.properties')) {
      let response = NextResponse.rewrite(new URL(`/agent${request.nextUrl.pathname}`, request.url));
      const cookies = request.cookies.getAll()
      for (const cookie of cookies) {
        response.cookies.set(cookie.name, cookie.value)
      }
  }

  return NextResponse.next(); // fallback
}
