import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const url = request.nextUrl.clone();
  if (url.pathname === '/') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // Jika mengakses halaman login dan sudah ada token, redirect ke dashboard
  if (request.nextUrl.pathname === '/login' && token) {
    const role = request.cookies.get('userRole')?.value;
    if (role === 'hr') {
      return NextResponse.redirect(new URL('/dashboard/hr', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika mengakses halaman dashboard atau profile tanpa token, redirect ke login
  if ((request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname === '/profile') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*']
};