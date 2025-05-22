import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const token = request.cookies.get('token')?.value;

  const timestamp = request.headers.get('x-timestamp');
  const signature = request.headers.get('x-signature');

  if (!timestamp || !signature) {
    return NextResponse.json({ message: "Header signature tidak lengkap" }, { status: 400 });
  }

  const apiUrl = `${process.env.API_URL}/v1/api/attendance/get-byid`;

  const headers: HeadersInit = {
    "Accept": "application/json",
    "x-timestamp": timestamp,
    "x-signature": signature
  };

  if (token) {
    headers["Cookie"] = `token=${token}`;
  }

  try {

    const response = await fetch(
      apiUrl, {
      method: "GET",
      headers,
    }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching attendance detail:", error);
    return NextResponse.json(
      { message: "Gagal mengambil detail attendance" },
      { status: 500 }
    );
  }
}