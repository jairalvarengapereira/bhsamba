import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const pool = new Pool({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getUpcomingShows() {
  return await prisma.shows.findMany({
    where: {
      date: { gte: new Date() },
      isPublished: true,
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  });
}

export async function getMembers() {
  return await prisma.members.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
}

export async function getMedia(showId?: string) {
  return await prisma.media.findMany({
    where: showId ? { showId } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findMany();
  const result: Record<string, string> = {};
  settings.forEach((s: { key: string; value: string }) => { result[s.key] = s.value; });
  return result;
}