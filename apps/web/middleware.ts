import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|sw.js).*)'],
};

const PUBLIC_FILE = /\.(.*)$/i

export function middleware(request: NextRequest) {
 const host = request.headers.get('host')
 const url = request.nextUrl.clone()
 let prefix = ''

  if (
    PUBLIC_FILE.test(url.pathname) ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api/auth') || // allow API routes like /api/auth/*
    url.pathname.startsWith('/api/activate') || // allow API routes like /api/auth/*
    url.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  if (host?.includes(process.env.NEXT_BUYER_DOMAIN || 'buyer.metaland.properties')) {
    prefix = '/buyer'
  }  else if(host?.includes(process.env.NEXT_AGENT_DOMAIN || 'agent.metaland.properties')) {
    prefix = '/agent'
  }  else if(host?.includes(process.env.NEXT_ADMIN_DOMAIN || 'admin.metaland.properties')) {
    prefix = '/admin'
  }

  if(prefix) {
    const redirectUrl = new URL(`${prefix}${request.nextUrl.pathname}`, request.url)
    redirectUrl.search = url.searchParams.toString()
    let response = NextResponse.rewrite(redirectUrl)
    request.headers.forEach((value, name) => {
      try {
        response.headers.set(name, value)
      } catch (err) {
        throw new Error(`Failed to set header ${name}: ${err}`);
      }
    })
      const cookies = request.cookies.getAll()
      for (const cookie of cookies) {
        response.cookies.set(cookie.name, cookie.value)
      }
    return response ;
  }

  return NextResponse.next(); // fallback
}
