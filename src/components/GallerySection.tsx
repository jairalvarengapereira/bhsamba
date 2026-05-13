'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Media {
  id: string;
  type: string;
  url: string;
  caption: string | null;
}

interface GallerySectionProps {
  media: Media[];
  id?: string;
}

export default function GallerySection({ media, id }: GallerySectionProps) {
  const [lightbox, setLightbox] = useState<Media | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    if (lightbox) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [lightbox]);

  const openLightbox = (item: Media, index: number) => {
    setLightbox(item);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setLightbox(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = (selectedIndex + 1) % media.length;
    setSelectedIndex(next);
    setLightbox(media[next]);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = (selectedIndex - 1 + media.length) % media.length;
    setSelectedIndex(prev);
    setLightbox(media[prev]);
  };

  return (
    <>
      <section id={id} className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-full h-48 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent" />
          <div className="absolute bottom-0 right-1/4 w-full h-48 bg-gradient-to-t from-[#C5A059]/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5A059]/5 rounded-full blur-[250px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full glass text-[#C5A059] text-sm font-medium mb-4">
              📸 Momentos
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
              Galeria
            </h2>
            <p className="text-[#F5F5F5]/60 text-lg max-w-2xl mx-auto">
              Momentos inesquecíveis dos nossos shows
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#C5A059] via-[#F9C412] to-[#C5A059] mx-auto mt-6 rounded-full" />
          </div>
          
          {media.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-[#8B5CF6]/20 rounded-full blur-2xl animate-pulse" />
                <span className="relative text-8xl">📷</span>
              </div>
              <p className="text-2xl text-[#F5F5F5]/60 mb-6">Galeria vazia - Em breve!</p>
              <Link href="#contato" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#F9C412] text-black font-bold rounded-full hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 transform hover:scale-105">
                <span>📸</span> Quer dividir esse momento? Fale conosco!
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {media.slice(0, 8).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => openLightbox(item, index)}
                    className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#C5A059]/20 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#002776] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                    
                    <Image
                      src={item.url}
                      alt={item.caption || 'Galeria BHSamba'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="w-16 h-16 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-40 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-medium text-center">{item.caption}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {media.length > 8 && (
                <div className="text-center mt-10">
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-[#F5F5F5]/50">
                    <span>+ {media.length - 8} fotos</span>
                    <span className="text-[#C5A059]">📷</span>
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lightbox && media.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-xl animate-fade-in">
          <button 
            className="absolute top-6 right-6 w-14 h-14 rounded-full glass flex items-center justify-center text-[#C5A059] hover:text-[#F9C412] hover:bg-[#C5A059]/20 transition-all duration-300 z-50" 
            onClick={closeLightbox}
          >
            <span className="text-3xl">✕</span>
          </button>
          
          <Link 
            href="/" 
            className="absolute top-6 left-6 px-5 py-3 rounded-full glass flex items-center gap-2 text-white hover:bg-[#C5A059]/20 transition-all duration-300 z-50"
            onClick={closeLightbox}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Voltar</span>
          </Link>
          
          {media.length > 1 && (
            <>
              <button 
                className="absolute left-6 w-14 h-14 rounded-full glass flex items-center justify-center text-[#C5A059] hover:text-[#F9C412] hover:bg-[#C5A059]/20 transition-all duration-300 z-50 text-4xl hover:scale-110" 
                onClick={prevImage}
              >
                ‹
              </button>
              <button 
                className="absolute right-6 w-14 h-14 rounded-full glass flex items-center justify-center text-[#C5A059] hover:text-[#F9C412] hover:bg-[#C5A059]/20 transition-all duration-300 z-50 text-4xl hover:scale-110" 
                onClick={nextImage}
              >
                ›
              </button>
            </>
          )}
          
          <div className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center p-8">
            <div className="relative w-full h-full flex items-center justify-center rounded-3xl overflow-hidden glass animate-scale-in">
              <Image 
                src={lightbox.url} 
                alt={lightbox.caption || 'Galeria'} 
                fill 
                className="object-contain" 
                sizes="100vw" 
              />
            </div>
            {lightbox.caption && (
              <div className="absolute bottom-0 left-0 right-0 text-center p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-3xl">
                <p className="text-white text-xl font-medium">{lightbox.caption}</p>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2 rounded-full glass">
            <span className="text-[#C5A059]">{selectedIndex + 1}</span>
            <span className="text-[#F5F5F5]/40">/</span>
            <span className="text-[#F5F5F5]/60">{media.length}</span>
          </div>
        </div>
      )}
    </>
  );
}