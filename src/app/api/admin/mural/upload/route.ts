import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMessage } from '@/lib/mural';

function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin-token');
  return cookie?.value === 'authenticated';
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const senderPhone = formData.get('senderPhone') as string || 'manual';
    const senderName = formData.get('senderName') as string || 'Admin Upload';
    const memberId = formData.get('memberId') as string || null;
    const duration = formData.get('duration') as string || null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.name.split('.').pop() || 'ogg';
    const filename = `voice/${uniqueSuffix}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('bhsamba')
      .upload(filename, buffer, {
        contentType: file.type || 'audio/ogg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('bhsamba').getPublicUrl(filename);

    const message = await createMessage({
      senderPhone,
      senderName,
      audioUrl: urlData.publicUrl,
      duration: duration ? parseInt(duration) : undefined,
      memberId: memberId || undefined,
    });

    return NextResponse.json({
      url: urlData.publicUrl,
      filename,
      messageId: message.id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
