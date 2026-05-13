'use client';

import Link from 'next/link';

interface SocialLinksProps {
  instagram?: string;
  youtube?: string;
  id?: string;
}

function normalizeUrl(url?: string, type?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (type === 'instagram' || url.includes('instagram')) {
    return 'https://instagram.com/' + url.replace('instagram.com/', '').replace('instagram.com/', '');
  }
  if (type === 'youtube' || url.includes('youtube')) {
    return 'https://youtube.com/' + url.replace('youtube.com/', '').replace('@', '');
  }
  return 'https://' + url;
}

const socialButtons = [
  { 
    name: 'Instagram', 
    url: 'instagram',
    icon: 'instagram',
    color: 'hover:shadow-[0_0_30px_rgba(228,64,95,0.5)]',
    gradient: 'from-[#E4405F] via-[#F56040] to-[#FCAF45]',
  },
  { 
    name: 'YouTube', 
    url: 'youtube',
    icon: 'youtube',
    color: 'hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]',
    gradient: 'from-[#FF0000] via-[#CC0000] to-[#990000]',
  },
];

export default function SocialLinks({ instagram, youtube, id }: SocialLinksProps) {
  const instagramUrl = normalizeUrl(instagram, 'instagram') || 'https://instagram.com/bhsamba';
  const youtubeUrl = normalizeUrl(youtube, 'youtube') || 'https://youtube.com/@bhsamba';

  return (
    <section id={id} className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#002776]/50" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/10 rounded-full blur-[200px]" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#C5A059]/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-[#009B3A]/10 to-transparent" />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-[#C5A059] text-sm font-medium mb-4">
            🌐 Conecte-se
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
            Siga a gente
          </h2>
          <p className="text-[#F5F5F5]/60 text-lg max-w-2xl mx-auto">
            Não perde nenhuma! Siga nossas redes sociais
          </p>
        </div>
        
        <div className="flex justify-center gap-6 flex-wrap">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-110 hover:-translate-y-2"
            style={{ animationDelay: '0ms' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${socialButtons[0].gradient} opacity-90`} />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300" />
          </a>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-110 hover:-translate-y-2"
            style={{ animationDelay: '100ms' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${socialButtons[1].gradient} opacity-90`} />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300" />
          </a>
        </div>
        
        <div className="text-center mt-16">
          <Link 
            href="#contato" 
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#F9C412] text-black font-bold rounded-full hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-2xl">💬</span>
            <span>Quer divider esse momento? Fale conosco!</span>
          </Link>
        </div>
        
        <div className="mt-20 pt-12 border-t border-[#C5A059]/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-sm" />
                <img src="/Logo.png" alt="BHSamba" className="relative w-full h-full object-contain" />
              </div>
              <span className="text-[#C5A059] font-bold text-lg">BHSamba</span>
            </div>
            <p className="text-[#F5F5F5]/40 text-sm text-center">
              Copyright © 2024 Jair Alvarenga Pereira. Todos os direitos reservados.
            </p>
            <Link 
              href="/admin/login" 
              className="text-[#F5F5F5]/30 text-xs hover:text-[#C5A059] transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}