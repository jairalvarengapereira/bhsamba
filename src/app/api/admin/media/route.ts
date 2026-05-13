import { NextRequest, NextResponse } from 'next/server';
import { getMedia, createMedia, updateMedia, deleteMedia } from '@/lib/admin';

export async function GET() {
  try {
    const media = await getMedia();
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const media = await createMedia(body);
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const media = await updateMedia(body.id, body);
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await deleteMedia(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}