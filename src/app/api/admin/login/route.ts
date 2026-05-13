import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body;

  if (password === process.env.ADMIN_TOKEN) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-token', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}