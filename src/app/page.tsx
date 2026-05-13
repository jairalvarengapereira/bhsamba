export const dynamic = 'force-dynamic';

import HeroSection from '@/components/HeroSection';
import MembersSection from '@/components/MembersSection';
import AgendaSection from '@/components/AgendaSection';
import GallerySection from '@/components/GallerySection';
import WhatsAppButton from '@/components/WhatsAppButton';
import SocialLinks from '@/components/SocialLinks';
import Menu from '@/components/Menu';
import { getUpcomingShows, getMembers, getMedia, getSiteSettings } from '@/lib/db';

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  order: number;
}

interface Show {
  id: string;
  title: string;
  description: string | null;
  venue: string;
  address: string | null;
  date: Date;
  time: string | null;
  ticketUrl: string | null;
  imageUrl: string | null;
}

interface Media {
  id: string;
  type: string;
  url: string;
  caption: string | null;
}

export default async function Home() {
  let shows: Show[] = [];
  let members: Member[] = [];
  let media: Media[] = [];
  let settings: Record<string, string> = {};

  try { shows = await getUpcomingShows() as Show[]; } catch {}
  try { members = await getMembers() as Member[]; } catch {}
  try { media = await getMedia() as Media[]; } catch {}
  try { settings = await getSiteSettings(); } catch {}

  const whatsappNumber = settings.whatsapp_number || '5531988887777';
  const heroSubtitle = settings.hero_subtitle || 'O melhor do samba de Belo Horizonte';
  const instagram = settings.instagram;
  const youtube = settings.youtube;

  return (
    <main className="min-h-screen bg-black">
      <Menu />
      
      <HeroSection
        title="BHSamba"
        subtitle={heroSubtitle}
      />
      
      <MembersSection members={members} id="historia" showHistory={true} />
      
      <MembersSection members={members} id="componentes" showHistory={false} title="Componentes" />
      
      <AgendaSection shows={shows} id="agenda" />
      
      <GallerySection media={media} id="galeria" />
      
      <SocialLinks id="contato" instagram={instagram} youtube={youtube} />
      
      <WhatsAppButton phoneNumber={whatsappNumber} />
    </main>
  );
}