import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get('admin-token');
  if (cookie?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}