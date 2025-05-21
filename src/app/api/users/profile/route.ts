import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const timestamp = request.headers.get('x-timestamp');
  const signature = request.headers.get('x-signature');

  const token = request.cookies.get('token')?.value;

  if (!timestamp || !signature) {
    return NextResponse.json({ message: "Header signature tidak lengkap" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ message: "ID tidak ditemukan" }, { status: 400 });
  }

  const apiUrl = `${process.env.API_URL}/v1/api/detail-users/get-byid/${id}`;

  const headers: HeadersInit = {
    "Accept": "application/json",
    "x-timestamp": timestamp,
    "x-signature": signature
  };

  if (token) {
    headers["Cookie"] = `token=${token}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Gagal mendapatkan data profil" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
