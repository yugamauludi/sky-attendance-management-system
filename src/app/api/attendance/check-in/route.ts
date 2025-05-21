import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const timestamp = request.headers.get('x-timestamp');
        const signature = request.headers.get('x-signature');

        const token = request.cookies.get('token')?.value;

        if (!timestamp || !signature) {
            return NextResponse.json(
                { message: "Header signature tidak lengkap" },
                { status: 400 }
            );
        }

        const headers: HeadersInit = {
            "Accept": "application/json",
            "x-timestamp": timestamp,
            "x-signature": signature
        };

        if (token) {
            headers["Cookie"] = `token=${token}`;
        }

        // Kirim ke API backend
        const response = await fetch(
            `${process.env.API_URL}/v1/api/attendance/In`,
            {
                method: "POST",
                headers,
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || "Gagal melakukan check-in" },
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