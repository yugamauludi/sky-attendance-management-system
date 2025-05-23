import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const timestamp = request.headers.get('x-timestamp');
    const signature = request.headers.get('x-signature');
    const token = request.headers.get('Authorization');

    if (!timestamp || !signature) {
      return NextResponse.json(
        { message: "Header signature tidak lengkap" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    const response = await fetch(
      `${process.env.API_URL}/v1/api/detail-users/updated/${id}`,
      {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
          "Authorization": token || '',
        },
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Gagal mengupdate profile" },
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