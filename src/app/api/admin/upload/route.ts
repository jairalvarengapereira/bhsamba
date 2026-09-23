import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get('admin-token');
  if (!cookie) return false;
  if (cookie.value === 'authenticated') return true;
  // Compatibilidade com rota legada /api/admin/login que salva o token puro
  if (process.env.ADMIN_TOKEN && cookie.value === process.env.ADMIN_TOKEN) return true;
  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas.' },
      { status: 500 }
    );
  }

  const supabaseUrl = rawUrl.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');
  let supabaseHost = 'invalid-url';
  try {
    supabaseHost = new URL(supabaseUrl).host;
  } catch {
    console.error('Supabase URL inválida configurada. Len:', supabaseUrl.length);
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_SUPABASE_URL inválida no Vercel.', code: 'SUPABASE_BAD_URL' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey.trim());

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: `Tipo de arquivo inválido (${file.type || 'desconhecido'}). Envie uma imagem.` },
        { status: 400 }
      );
    }

    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `Imagem muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Limite de 5 MB.` },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const ext = rawExt.replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
    const filename = `${uniqueSuffix}.${ext}`;

    const { data, error } = await supabase.storage
      .from('bhsamba')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      const msg = error.message || 'unknown';
      console.error(
        `Supabase upload error host=${supabaseHost} bucket=bhsamba size=${file.size} type=${file.type}:`,
        JSON.stringify(error)
      );
      if (msg.includes('fetch failed') || msg.includes('Failed to fetch') || msg.includes('ENOTFOUND')) {
        return NextResponse.json(
          {
            error: `Supabase inalcançável (${supabaseHost}). Verifique NEXT_PUBLIC_SUPABASE_URL no Vercel, se o projeto Supabase está ativo e se o bucket 'bhsamba' existe.`,
            code: 'SUPABASE_UNREACHABLE',
            host: supabaseHost,
          },
          { status: 500 }
        );
      }
      if (msg.includes('Bucket not found') || msg.includes('bucket')) {
        return NextResponse.json(
          {
            error: `Bucket 'bhsamba' não encontrado no projeto ${supabaseHost}. Crie o bucket no Supabase Storage.`,
            code: 'SUPABASE_BUCKET_NOT_FOUND',
            host: supabaseHost,
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: 'Upload failed: ' + msg, code: 'SUPABASE_UPLOAD_ERROR', host: supabaseHost },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from('bhsamba').getPublicUrl(filename);

    return NextResponse.json({
      url: urlData.publicUrl,
      filename
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Upload error:', message, error);
    return NextResponse.json(
      { error: 'Upload failed: ' + message, code: 'INTERNAL_UPLOAD_ERROR' },
      { status: 500 }
    );
  }
}