import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imagePath = searchParams.get('path');
  
  if (!imagePath) {
    return new NextResponse('Path tidak ditemukan', { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const imageUrl = `${baseUrl}/${imagePath}`;

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Gagal memuat gambar', { status: 500 });
  }
}