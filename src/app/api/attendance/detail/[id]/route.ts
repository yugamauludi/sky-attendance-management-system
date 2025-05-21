import { getSignature } from "@/services/signature";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { timestamp, signature } = await getSignature();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/api/attendance/get-byid/${params.id}`,
      {
        headers: {
          Accept: "application/json",
          "x-timestamp": timestamp,
          "x-signature": signature,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil detail attendance");
    }

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