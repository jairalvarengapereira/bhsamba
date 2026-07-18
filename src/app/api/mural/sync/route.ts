import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMessage, findMemberByPhone } from '@/lib/mural';
import { prisma } from '@/lib/db';

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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return handleSync();
}

export async function POST(request: NextRequest) {
  return handleSync();
}

async function handleSync() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const evoUrl = process.env.EVOLUTION_API_URL;
    const evoKey = process.env.EVOLUTION_API_KEY;
    const instance = process.env.EVOLUTION_INSTANCE || 'bhsamba';
    const groupId = process.env.MURAL_GROUP_ID;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    if (!evoUrl || !evoKey || !groupId) {
      return NextResponse.json({ error: 'Evolution API not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const lastMessage = await prisma.voiceMessages.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const since = lastMessage
      ? Math.floor(lastMessage.createdAt.getTime() / 1000) - 60
      : undefined;

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
      return NextResponse.json(
        { error: `Evolution API error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const messages: EvolutionMessage[] = data.messages?.records || [];

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
      const msgTimestamp = msg.messageTimestamp
        ? new Date(msg.messageTimestamp * 1000)
        : new Date();

      const existingMsg = await prisma.voiceMessages.findFirst({
        where: {
          senderPhone: msg.key.participant || msg.key.remoteJid,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (existingMsg) {
        const timeDiff = Math.abs(
          msgTimestamp.getTime() - existingMsg.createdAt.getTime()
        );
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

      let audioBuffer: Buffer | null = null;

      if (audioUrl) {
        try {
          const audioResponse = await fetch(audioUrl);
          if (audioResponse.ok) {
            const arrayBuffer = await audioResponse.arrayBuffer();
            audioBuffer = Buffer.from(arrayBuffer);
          }
        } catch (err) {
          console.error('Error downloading audio:', err);
        }
      }

      if (!audioBuffer || audioBuffer.length < 100) {
        errors.push(`No audio data for message ${msg.key.id}`);
        continue;
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `voice/${uniqueSuffix}.ogg`;

      const { error: uploadError } = await supabase.storage
        .from('bhsamba')
        .upload(filename, audioBuffer, {
          contentType: 'audio/ogg',
          upsert: false,
        });

      if (uploadError) {
        errors.push(`Upload failed for ${msg.key.id}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('bhsamba')
        .getPublicUrl(filename);

      const member = await findMemberByPhone(senderPhone);

      await createMessage({
        senderPhone,
        senderName: senderName || undefined,
        audioUrl: urlData.publicUrl,
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
