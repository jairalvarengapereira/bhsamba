'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  order: number;
}

interface MembersSectionProps {
  members: Member[];
  id?: string;
  showHistory?: boolean;
  title?: string;
}

const historyText = (
  <>
    <p className="text-lg text-[#F5F5F5]/80 leading-relaxed">
      O BHSamba não é apenas um grupo; é o encontro de destinos que se cruzam há décadas pelos palcos e esquinas de Belo Horizonte. Nascido oficialmente em meados de 2020, o projeto é a coroação de uma amizade forjada no final dos anos 80.
    </p>
    <div className="my-8 p-6 rounded-2xl glass border border-[#C5A059]/20">
      <h3 className="text-xl font-bold text-[#C5A059] mb-3 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center">👥</span>
        O Alicerce: Uma Amizade de Quatro Décadas
      </h3>
      <p className="text-[#F5F5F5]/70">
        A base do BHSamba está no olhar de quem já dividiu o palco quando o pagode 90 ainda era a trilha sonora das rádios e as rodas de samba de raiz eram o refúgio da alma.
      </p>
    </div>
    <div className="my-8 p-6 rounded-2xl glass border border-[#009B3A]/20">
      <h3 className="text-xl font-bold text-[#009B3A] mb-3 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#009B3A]/20 flex items-center justify-center">🏘️</span>
        A Raiz da Zona Norte
      </h3>
      <p className="text-[#F5F5F5]/70">
        Com o DNA cravado na Zona Norte, o grupo é um legítimo representante da resistência e da alegria periférica. É desse celeiro cultural que emana a sonoridade autêntica do BHSamba.
      </p>
    </div>
    <div className="my-8 p-6 rounded-2xl glass border border-[#8B5CF6]/20">
      <h3 className="text-xl font-bold text-[#8B5CF6] mb-3 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">🎶</span>
        Vasta Experiência e Novos Caminhos
      </h3>
      <p className="text-[#F5F5F5]/70">
        Embora o grupo tenha sido formalizado recentemente, cada músico carrega consigo a história de bandas e projetos que ajudaram a construir a identidade musical de Minas Gerais.
      </p>
    </div>
    <div className="mt-10 text-center">
      <span className="text-4xl">🎵</span>
      <p className="text-xl text-[#C5A059] italic mt-3">
        BHSamba: Onde a história de quem vive o samba encontra a batida de quem nunca deixou a essência morrer.
      </p>
    </div>
  </>
);

export default function MembersSection({ members, id, showHistory = false, title }: MembersSectionProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    if (selectedMember) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  const displayTitle = title || (showHistory ? 'História' : 'Componentes');

  if (!showHistory && !members.length) return null;

  return (
    <section id={id} className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#C5A059]/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#009B3A]/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[200px]" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full glass text-[#C5A059] text-sm font-medium mb-4">
            🎭 Conheça nosso time
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
            {displayTitle}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C5A059] via-[#F9C412] to-[#C5A059] mx-auto rounded-full" />
        </div>
        
        {showHistory && (
          <div className="text-[#F5F5F5]/80 text-base md:text-lg leading-relaxed max-w-4xl mx-auto animate-fade-in">
            {historyText}
          </div>
        )}
        
        {!showHistory && members.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 perspective-1000">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="group cursor-pointer perspective-1000"
                onClick={() => setSelectedMember(member)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-[#C5A059]/20 preserve-3d">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#002776] via-[#1a0a2e] to-black" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-[#C5A059]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 border border-[#C5A059]/0 group-hover:border-[#C5A059]/30 rounded-3xl transition-all duration-500" />
                  
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#002776] to-[#8B5CF6]">
                      <span className="text-8xl font-bold text-[#C5A059]/30">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-[#009B3A] font-medium text-sm">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center transform translate-x-4 group-hover:translate-x-0">
                    <span className="text-lg">👁️</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in cursor-pointer p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div 
            className="max-w-3xl w-full bg-gradient-to-br from-[#0a0a0a] via-[#002776]/20 to-[#1a0a2e]/50 rounded-3xl p-8 cursor-default glass border border-[#C5A059]/20 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full glass flex items-center justify-center text-[#C5A059] hover:text-[#F9C412] hover:bg-[#C5A059]/20 transition-all"
            >
              <span className="text-2xl">✕</span>
            </button>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-[#C5A059]/30 shadow-2xl shadow-[#C5A059]/20 animate-glow">
                  {selectedMember.imageUrl ? (
                    <Image src={selectedMember.imageUrl} alt={selectedMember.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#002776] to-[#8B5CF6] flex items-center justify-center">
                      <span className="text-6xl font-bold text-[#C5A059]">{selectedMember.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#C5A059] to-[#F9C412] flex items-center justify-center animate-float">
                  <span className="text-3xl">🎵</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-sm mb-3">
                  Componente
                </span>
                <h3 className="text-4xl font-bold text-gradient mb-2">{selectedMember.name}</h3>
                <p className="text-2xl text-[#009B3A] neon-green font-medium mb-4">{selectedMember.role}</p>
                {selectedMember.bio && (
                  <p className="text-[#F5F5F5]/80 text-lg leading-relaxed">{selectedMember.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}