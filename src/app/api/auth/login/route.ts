import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Validasi kredensial dengan database
    // Ini hanya contoh, ganti dengan logika autentikasi yang sebenarnya
    if (email === 'admin@example.com' && password === 'password') {
      const token = signJWT({
        sub: '1', // user id dari database
        email: email,
        role: 'hr', // role hr untuk admin
      });

      return NextResponse.json({ 
        token,
        role: 'hr'
      });
    } else if (email === 'employee@example.com' && password === 'password') {
      const token = signJWT({
        sub: '2', // user id dari database
        email: email,
        role: 'employee', // role karyawan
      });

      return NextResponse.json({ 
        token,
        role: 'employee'
      });
    }

    return NextResponse.json(
      { error: 'Email atau kata sandi salah' },
      { status: 401 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}