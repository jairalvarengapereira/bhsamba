import { prisma } from './db';

export async function getMembers() {
  return await prisma.members.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function createMember(data: {
  name: string;
  role: string;
  bio?: string;
  bioHistory?: string;
  imageUrl?: string;
  order?: number;
}) {
  return await prisma.members.create({
    data: {
      name: data.name,
      role: data.role,
      bio: data.bio || null,
      bioHistory: data.bioHistory || null,
      imageUrl: data.imageUrl || null,
      order: data.order || 0,
      isActive: true,
    },
  });
}

export async function updateMember(id: string, data: {
  name?: string;
  role?: string;
  bio?: string;
  bioHistory?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}) {
  return await prisma.members.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.role && { role: data.role }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.bioHistory !== undefined && { bioHistory: data.bioHistory }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

export async function deleteMember(id: string) {
  return await prisma.members.delete({
    where: { id },
  });
}

export async function getShows() {
  return await prisma.shows.findMany({
    orderBy: { date: 'asc' },
  });
}

export async function createShow(data: {
  title: string;
  description?: string;
  venue: string;
  address?: string;
  date: string;
  time?: string;
  ticketUrl?: string;
  imageUrl?: string;
}) {
  return await prisma.shows.create({
    data: {
      title: data.title,
      description: data.description || null,
      venue: data.venue,
      address: data.address || null,
      date: new Date(data.date),
      time: data.time || null,
      ticketUrl: data.ticketUrl || null,
      imageUrl: data.imageUrl || null,
      isPublished: true,
    },
  });
}

export async function updateShow(id: string, data: {
  title?: string;
  description?: string;
  venue?: string;
  address?: string;
  date?: string;
  time?: string;
  ticketUrl?: string;
  imageUrl?: string;
  isPublished?: boolean;
}) {
  return await prisma.shows.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.venue && { venue: data.venue }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.time !== undefined && { time: data.time }),
      ...(data.ticketUrl !== undefined && { ticketUrl: data.ticketUrl }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
    },
  });
}

export async function deleteShow(id: string) {
  return await prisma.shows.delete({
    where: { id },
  });
}

export async function getMedia() {
  return await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMedia(data: {
  type?: string;
  url: string;
  caption?: string;
  showId?: string;
}) {
  return await prisma.media.create({
    data: {
      type: data.type || 'image',
      url: data.url,
      caption: data.caption || null,
      showId: data.showId || null,
    },
  });
}

export async function updateMedia(id: string, data: {
  type?: string;
  url?: string;
  caption?: string;
  showId?: string;
}) {
  return await prisma.media.update({
    where: { id },
    data: {
      ...(data.type && { type: data.type }),
      ...(data.url && { url: data.url }),
      ...(data.caption !== undefined && { caption: data.caption }),
      ...(data.showId !== undefined && { showId: data.showId }),
    },
  });
}

export async function deleteMedia(id: string) {
  return await prisma.media.delete({
    where: { id },
  });
}

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findMany();
  const result: Record<string, string> = {};
  settings.forEach((s: { key: string; value: string }) => { result[s.key] = s.value; });
  return result;
}

export async function updateSiteSetting(key: string, value: string) {
  return await prisma.siteSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}