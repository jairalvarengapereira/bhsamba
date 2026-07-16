import { prisma } from './db';

export async function getVoiceMessages() {
  return await prisma.voiceMessages.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      member: true,
    },
  });
}

export async function getApprovedMessages() {
  return await prisma.voiceMessages.findMany({
    where: { status: 'approved' },
    orderBy: { createdAt: 'desc' },
    include: {
      member: true,
    },
  });
}

export async function getPendingMessages() {
  return await prisma.voiceMessages.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    include: {
      member: true,
    },
  });
}

export async function createMessage(data: {
  senderPhone: string;
  senderName?: string;
  audioUrl: string;
  duration?: number;
  memberId?: string;
}) {
  const member = data.memberId
    ? await prisma.members.findUnique({ where: { id: data.memberId } })
    : await prisma.members.findFirst({ where: { phone: data.senderPhone } });

  return await prisma.voiceMessages.create({
    data: {
      senderPhone: data.senderPhone,
      senderName: data.senderName || member?.name || null,
      audioUrl: data.audioUrl,
      duration: data.duration || null,
      status: 'pending',
      memberId: member?.id || data.memberId || null,
    },
    include: {
      member: true,
    },
  });
}

export async function updateMessageStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
  return await prisma.voiceMessages.update({
    where: { id },
    data: { status },
    include: {
      member: true,
    },
  });
}

export async function deleteMessage(id: string) {
  return await prisma.voiceMessages.delete({
    where: { id },
  });
}

export async function findMemberByPhone(phone: string) {
  const normalized = phone.replace(/\D/g, '');
  return await prisma.members.findFirst({
    where: {
      phone: { contains: normalized },
    },
  });
}
