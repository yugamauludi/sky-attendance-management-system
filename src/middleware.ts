import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const role = request.cookies.get('userRole')?.value;
  const url = request.nextUrl.clone();

  // Redirect ke login jika mengakses root
  if (url.pathname === '/') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // Redirect ke dashboard yang sesuai jika sudah login
  if (request.nextUrl.pathname === '/login' && token) {
    if (role === 'hr') {
      return NextResponse.redirect(new URL('/dashboard/hr', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Cek otorisasi untuk halaman HR
  if (request.nextUrl.pathname.startsWith('/dashboard/hr')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role !== 'hr') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Cek otorisasi untuk halaman dashboard biasa
  if (request.nextUrl.pathname === '/dashboard') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Cek otorisasi untuk halaman employee-list
  if (request.nextUrl.pathname === '/employee-list') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (role !== 'hr') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/profile', '/employee-list']
};