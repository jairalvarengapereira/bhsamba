import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const path = req.nextUrl.pathname.replace('/api/admin/', '');
  const [table, id] = path.split('/');

  if (req.method === 'GET') {
    const model = table === 'shows' ? prisma.shows 
               : table === 'members' ? prisma.members 
               : table === 'media' ? prisma.media 
               : table === 'settings' ? prisma.siteSettings : null;
    if (!model) return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    const data = await (model as any).findMany();
    return NextResponse.json(data);
  }

  if (req.method === 'POST') {
    const body = await req.json();
    let data;
    if (table === 'shows') data = await prisma.shows.create({ data: body });
    else if (table === 'members') data = await prisma.members.create({ data: body });
    else if (table === 'media') data = await prisma.media.create({ data: body });
    else if (table === 'settings') data = await prisma.siteSettings.create({ data: body });
    else return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  if (req.method === 'PUT') {
    const body = await req.json();
    let data;
    if (table === 'shows') data = await prisma.shows.update({ where: { id }, data: body });
    else if (table === 'members') data = await prisma.members.update({ where: { id }, data: body });
    else if (table === 'media') data = await prisma.media.update({ where: { id }, data: body });
    else if (table === 'settings') data = await prisma.siteSettings.update({ where: { id }, data: body });
    else return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  if (req.method === 'DELETE') {
    if (table === 'shows') await prisma.shows.delete({ where: { id } });
    else if (table === 'members') await prisma.members.delete({ where: { id } });
    else if (table === 'media') await prisma.media.delete({ where: { id } });
    else if (table === 'settings') await prisma.siteSettings.delete({ where: { id } });
    else return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };