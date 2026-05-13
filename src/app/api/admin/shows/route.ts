import { NextRequest, NextResponse } from 'next/server';
import { getShows, createShow, updateShow, deleteShow } from '@/lib/admin';

export async function GET() {
  try {
    const shows = await getShows();
    return NextResponse.json(shows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shows' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const show = await createShow(body);
    return NextResponse.json(show);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create show' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const show = await updateShow(body.id, body);
    return NextResponse.json(show);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update show' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await deleteShow(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete show' }, { status: 500 });
  }
}