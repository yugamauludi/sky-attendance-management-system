import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const timestamp = request.headers.get('x-timestamp');
    const signature = request.headers.get('x-signature');

    if (!timestamp || !signature) {
      return NextResponse.json(
        { message: "Header signature tidak lengkap" },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/v1/api/users/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "x-timestamp": timestamp,
        "x-signature": signature
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Gagal menghapus karyawan" },
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