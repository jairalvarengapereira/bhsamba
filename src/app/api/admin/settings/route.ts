import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSetting } from '@/lib/admin';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    const setting = await updateSiteSetting(key, value);
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}