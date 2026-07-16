import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMessage, findMemberByPhone } from '@/lib/mural';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.EVOLUTION_API_KEY;

    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const groupId = process.env.MURAL_GROUP_ID;
    const remoteJid = body.data?.key?.remoteJid;

    if (groupId && remoteJid !== groupId) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (body.event !== 'messages.upsert') {
      return NextResponse.json({ success: true, skipped: true });
    }

    const message = body.data?.message;
    if (!message) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const isAudioMessage = message.audioMessage || message.pttMessage;
    if (!isAudioMessage) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const senderPhone = body.data?.key?.participant || body.data?.pushName || 'unknown';
    const senderName = body.data?.pushName || null;
    const audioData = message.audioMessage || message.pttMessage;
    const duration = audioData?.seconds || null;

    let audioBase64: string | null = null;

    if (body.data?.message?.audioMessage?.url) {
      const audioUrl = body.data.message.audioMessage.url;
      try {
        const audioResponse = await fetch(audioUrl);
        if (audioResponse.ok) {
          const arrayBuffer = await audioResponse.arrayBuffer();
          audioBase64 = Buffer.from(arrayBuffer).toString('base64');
        }
      } catch (error) {
        console.error('Error downloading audio:', error);
      }
    }

    if (!audioBase64 && body.base64) {
      audioBase64 = body.base64;
    }

    if (!audioBase64) {
      return NextResponse.json({ error: 'No audio data found' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const audioBuffer = Buffer.from(audioBase64, 'base64');
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
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('bhsamba').getPublicUrl(filename);

    const member = await findMemberByPhone(senderPhone);

    const messageRecord = await createMessage({
      senderPhone,
      senderName,
      audioUrl: urlData.publicUrl,
      duration,
      memberId: member?.id,
    });

    return NextResponse.json({
      success: true,
      messageId: messageRecord.id,
      memberId: member?.id || null,
      memberName: member?.name || null,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
