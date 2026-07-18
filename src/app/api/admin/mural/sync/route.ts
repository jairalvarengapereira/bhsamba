import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMessage, findMemberByPhone } from '@/lib/mural';
import { prisma } from '@/lib/db';

function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin-token');
  return cookie?.value === 'authenticated';
}

interface EvolutionMessage {
  key: {
    id: string;
    remoteJid: string;
    fromMe: boolean;
    participant?: string;
  };
  pushName?: string;
  message?: {
    audioMessage?: {
      url?: string;
      mimetype?: string;
      ptt?: boolean;
      fileLength?: number;
      seconds?: number;
    };
  };
  messageType?: string;
  messageTimestamp?: number;
}

async function fetchMessagesFromEvolution(since?: number): Promise<EvolutionMessage[]> {
  const evoUrl = process.env.EVOLUTION_API_URL;
  const evoKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE || 'bhsamba';
  const groupId = process.env.MURAL_GROUP_ID;

  if (!evoUrl || !evoKey || !groupId) {
    throw new Error('Evolution API not configured');
  }

  const where: Record<string, unknown> = {
    key: { remoteJid: groupId },
  };

  if (since) {
    where.messageTimestamp = { gte: since };
  }

  const response = await fetch(`${evoUrl}/chat/findMessages/${instance}`, {
    method: 'POST',
    headers: {
      apikey: evoKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      where,
      take: 50,
      orderBy: { messageTimestamp: 'desc' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Evolution API error: ${response.status}`);
  }

  const data = await response.json();
  return data.messages?.records || [];
}

async function downloadAndUploadAudio(
  audioUrl: string,
  base64Data: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<string | null> {
  let audioBuffer: Buffer;

  if (base64Data) {
    audioBuffer = Buffer.from(base64Data, 'base64');
  } else if (audioUrl) {
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) return null;
    const arrayBuffer = await audioResponse.arrayBuffer();
    audioBuffer = Buffer.from(arrayBuffer);
  } else {
    return null;
  }

  if (audioBuffer.length < 100) return null;

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `voice/${uniqueSuffix}.ogg`;

  const { error: uploadError } = await supabase.storage
    .from('bhsamba')
    .upload(filename, audioBuffer, {
      contentType: 'audio/ogg',
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage.from('bhsamba').getPublicUrl(filename);
  return urlData.publicUrl;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const lastMessage = await prisma.voiceMessages.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const since = lastMessage
      ? Math.floor(lastMessage.createdAt.getTime() / 1000) - 60
      : undefined;

    const messages = await fetchMessagesFromEvolution(since);

    const audioMessages = messages.filter(
      (m) =>
        m.message?.audioMessage &&
        !m.key.fromMe &&
        m.messageType === 'audioMessage'
    );

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const msg of audioMessages) {
      const existingMsg = await prisma.voiceMessages.findFirst({
        where: { senderPhone: msg.key.participant || msg.key.remoteJid },
      });

      if (existingMsg) {
        const msgTimestamp = msg.messageTimestamp
          ? new Date(msg.messageTimestamp * 1000)
          : new Date();

        const timeDiff = Math.abs(msgTimestamp.getTime() - existingMsg.createdAt.getTime());
        if (timeDiff < 120000) {
          skipped++;
          continue;
        }
      }

      const audioData = msg.message?.audioMessage;
      const audioUrl = audioData?.url || '';
      const senderPhone = msg.key.participant || msg.key.remoteJid;
      const senderName = msg.pushName || null;
      const duration = audioData?.seconds || null;

      const publicUrl = await downloadAndUploadAudio(audioUrl, null, supabase);

      if (!publicUrl) {
        errors.push(`Failed to download audio for message ${msg.key.id}`);
        continue;
      }

      const member = await findMemberByPhone(senderPhone);

      await createMessage({
        senderPhone,
        senderName: senderName || undefined,
        audioUrl: publicUrl,
        duration: duration || undefined,
        memberId: member?.id,
      });

      synced++;
    }

    return NextResponse.json({
      success: true,
      total: messages.length,
      audioFound: audioMessages.length,
      synced,
      skipped,
      errors,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}
