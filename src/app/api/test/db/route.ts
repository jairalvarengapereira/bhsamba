import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL ? 'set' : 'not set';
    await prisma.$connect();
    const shows = await prisma.shows.findMany({ take: 1 });
    await prisma.$disconnect();
    return NextResponse.json({ status: 'connected', dbUrl, shows });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message, dbUrl: process.env.DATABASE_URL ? 'set' : 'not set' }, { status: 500 });
  }
}