import { NextRequest, NextResponse } from 'next/server';
import { getMembers, createMember, updateMember, deleteMember } from '@/lib/admin';

export async function GET() {
  try {
    const members = await getMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating member:', body);
    const member = await createMember(body);
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const member = await updateMember(body.id, body);
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await deleteMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}