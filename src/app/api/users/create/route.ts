import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const timestamp = request.headers.get('x-timestamp');
    const signature = request.headers.get('x-signature');
    const body = await request.json();

    if (!timestamp || !signature) {
      return NextResponse.json(
        { message: "Header signature tidak lengkap" },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/v1/api/users`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-timestamp": timestamp,
        "x-signature": signature
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Gagal menambahkan karyawan" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error detail:', error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}