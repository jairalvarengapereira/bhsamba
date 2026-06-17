'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from './Lightbox';

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

interface AgendaSectionProps {
  shows: Show[];
  id?: string;
}

function formatDate(date: Date) {
  const d = new Date(date);
  const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: months[d.getMonth()],
    weekday: days[d.getDay()],
    full: d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

export default function AgendaSection({ shows, id }: AgendaSectionProps) {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const sortedShows = [...shows].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return (a.time || '').localeCompare(b.time || '');
  });

  return (
    <>
      {lightboxImage && (
        <Lightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}

      <section id={id} className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#009B3A]/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full glass text-[#C5A059] text-sm font-medium mb-4">
              🎤 Não perca
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-4">
              Próximos Shows
            </h2>
            <p className="text-[#F5F5F5]/60 text-lg max-w-2xl mx-auto">
              Vem curtir com a gente! Shows imperdíveis em BH e região
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#C5A059] via-[#F9C412] to-[#C5A059] mx-auto mt-6 rounded-full" />
          </div>
          
          {shows.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-2xl animate-pulse" />
                <span className="relative text-8xl">🎉</span>
              </div>
              <p className="text-3xl text-gradient font-bold mb-3">Em breve!</p>
              <p className="text-[#F5F5F5]/60 text-lg mb-8">Fique ligado nas redes sociais para não perder</p>
              <div className="mt-8 flex justify-center gap-4">
                <a href="#contato" className="group px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#F9C412] text-black font-bold rounded-full hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  <span>📅</span> Agendar Show
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedShows.map((show, index) => {
                const dateInfo = formatDate(show.date);
                
                return (
                  <div
                    key={show.id}
                    className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.01] animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#002776] via-[#1a0a2e] to-[#002776]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/5 to-[#C5A059]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 border border-[#C5A059]/0 group-hover:border-[#C5A059]/20 rounded-3xl transition-all duration-500" />
                    
                    <div className="relative z-10 flex items-center gap-6 p-6 md:p-8">
                      <div className="flex items-center gap-4 md:gap-6 bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 rounded-2xl py-4 px-5 md:py-5 md:px-6 shrink-0 transition-colors duration-300">
                        <div className="flex flex-col items-center">
                          <div className="text-xs text-[#F5F5F5]/60 font-medium mb-1">{dateInfo.weekday}</div>
                          <div className="text-4xl md:text-5xl font-bold text-gradient leading-none">{dateInfo.day}</div>
                          <div className="text-base text-[#009B3A] font-bold">{dateInfo.month}</div>
                          {show.time && (
                            <div className="mt-2 text-lg text-[#F9C412] font-bold">{show.time}</div>
                          )}
                        </div>
                        {show.imageUrl && (
                          <div
                            className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden cursor-pointer group/image shadow-xl shadow-black/50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage({ src: show.imageUrl!, alt: show.title });
                            }}
                          >
                            <Image
                              src={show.imageUrl}
                              alt={show.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                              <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-center md:text-left">
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-[#C5A059] transition-colors">
                            {show.title}
                          </h3>
                          <div className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-2">
                            <p className="text-sm md:text-base text-[#F5F5F5]/70 flex items-center gap-1">
                              <span className="text-[#C5A059]">📍</span> {show.venue}
                            </p>
                            {show.address && (
                              <p className="text-xs md:text-sm text-[#F5F5F5]/50">
                                {show.address}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          {show.ticketUrl && (
                            <a
                              href={show.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn px-6 py-3 bg-gradient-to-r from-[#009B3A] to-[#4CAF50] text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#009B3A]/30 flex items-center gap-2"
                            >
                              <span>🎟️</span> Ingresso
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}