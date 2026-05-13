import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    
    const correctPassword = process.env.ADMIN_TOKEN || 'bhsamba2024';
    
    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin-token', 'authenticated', {
        httpOnly: false,
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('admin-token');
  if (cookie?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}