import { NextRequest, NextResponse } from 'next/server';
import { getApprovedMessages } from '@/lib/mural';

export async function GET(request: NextRequest) {
  try {
    const messages = await getApprovedMessages();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
