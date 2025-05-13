// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyJWT } from '@/lib/jwt';
// import { JWTPayload } from '@/types/user';

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;

//   // Daftar path yang memerlukan autentikasi
//   const authRequired = [
//     '/dashboard',
//     '/profile',
//     // Tambahkan path lain yang memerlukan autentikasi
//   ];

//   try {
//     // Cek apakah path saat ini memerlukan autentikasi
//     const requireAuth = authRequired.some(path => 
//       request.nextUrl.pathname.startsWith(path)
//     );

//     if (requireAuth) {
//       if (!token) {
//         return NextResponse.redirect(new URL('/login', request.url));
//       }

//       // Verifikasi token
//       const payload = verifyJWT<JWTPayload>(token);
      
//       // Tambahkan user info ke headers untuk digunakan di API routes
//       const requestHeaders = new Headers(request.headers);
//       requestHeaders.set('user', JSON.stringify(payload));

//       return NextResponse.next({
//         request: {
//           headers: requestHeaders,
//         },
//       });
//     }

//     return NextResponse.next();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     // Token tidak valid
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * 1. /api/auth/* (authentication routes)
//      * 2. /_next/* (Next.js system files)
//      * 3. /images/* (public files)
//      * 4. /favicon.ico, /sitemap.xml (static files)
//      */
//     '/((?!api/auth|_next|images|favicon.ico|sitemap.xml).*)',
//   ],
// };


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  // Jika mengakses halaman login dan sudah ada token, redirect ke dashboard
  if (request.nextUrl.pathname === '/login' && token) {
    const role = request.cookies.get('userRole')?.value;
    if (role === 'hr') {
      return NextResponse.redirect(new URL('/dashboard/hr', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika mengakses halaman dashboard tanpa token, redirect ke login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*']
};