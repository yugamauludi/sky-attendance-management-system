/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.API_URL) {
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
      cache: 'no-store',
      credentials: "include" 
    });

    const data = await response.json();
    const rawSetCookie = response.headers.get("set-cookie");

    const res = NextResponse.json({ 
      role: data?.user?.role === 1 ? 'hr' : 'employee',
      id: data?.user?.id,
      username: data?.user?.username,
      roleId: data?.user?.role,
    });

    if (rawSetCookie) {
      res.headers.set("Set-Cookie", rawSetCookie);
    }

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
