import { Metadata } from 'next';
import { getApprovedMessages } from '@/lib/mural';
import { getSiteSettings } from '@/lib/db';
import VoicMailSection from '@/components/VoicMailSection';
import SendVoiceButton from '@/components/SendVoiceButton';
import Menu from '@/components/Menu';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mural de Recados | BHSamba',
  description: 'Ouça os recados de voz dos componentes do BHSamba',
};

export default async function MuralPage() {
  let messages: any[] = [];
  let settings: Record<string, string> = {};

  try {
    [messages, settings] = await Promise.all([
      getApprovedMessages(),
      getSiteSettings(),
    ]);
  } catch (error) {
    console.error('Error loading mural data:', error);
  }

  const whatsappNumber = settings?.whatsapp_number || '5531988887777';

  const formattedMessages = (messages || []).map((msg: any) => ({
    ...msg,
    createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : String(msg.createdAt),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#002776]/20 to-[#0a0a0a]">
      <Menu />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#C5A059] mb-4">
              Mural de Recados
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Ouça os recados de voz dos componentes do BHSamba. 
              Cada membro pode enviar suas mensagens pelo WhatsApp!
            </p>
          </div>

          <VoicMailSection messages={formattedMessages} />

          <div className="mt-12 text-center">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Estou enviando um recado de voz para o Mural do BHSamba! 🎵🎤')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#009B3A] to-[#007A2E] text-white font-bold text-lg rounded-full hover:shadow-lg hover:shadow-[#009B3A]/30 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar Recado de Voz
            </a>
          </div>
        </div>
      </main>

      <SendVoiceButton phoneNumber={whatsappNumber} />
    </div>
  );
}
