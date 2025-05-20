import { NextResponse } from "next/server";
import { signJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  console.log('Processing login request...');
  
  if (!process.env.API_URL) {
    console.error('API_URL tidak ditemukan di environment variables');
    return NextResponse.json(
      { message: "Konfigurasi server tidak valid" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    const apiUrl = `${process.env.API_URL}/v1/api/auth/login`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await response.json();
    console.log('Response data:', data);
    if(data.user.role === 2){
      const token = signJWT({
        id: data.user.id,
        sub: data.user.role,
        email: data.user.username,
        role: 'hr',
      });

      return NextResponse.json({ 
        token,
        role: 'hr'
      });
    } else if(data.user.role === 1){
      const token = signJWT({
        id: data.user.id,
        sub: data.user.role,
        email: data.user.username,
        role: 'employee',
      });

      return NextResponse.json({
        token,
        role: 'employee'
      });
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Login gagal" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error detail:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}