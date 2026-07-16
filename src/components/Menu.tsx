'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'História', href: '#historia', icon: '📖' },
    { label: 'Componentes', href: '#componentes', icon: '🎵' },
    { label: 'Agenda', href: '#agenda', icon: '🎤' },
    { label: 'Galeria', href: '#galeria', icon: '📸' },
    { label: 'Recados', href: '/mural', icon: '🎙️' },
    { label: 'Contato', href: '#contato', icon: '💬' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-[#C5A059]/20' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center group cursor-pointer"
          >
            <div className={`relative transition-all duration-500 ${scrolled ? 'w-12 h-12' : 'w-16 h-16'} group-hover:scale-110`}>
              <Image
                src="/Logo.png"
                alt="BHSamba"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
            <span className={`ml-3 font-bold tracking-wide transition-all duration-500 ${
              scrolled 
                ? 'text-lg text-[#C5A059]' 
                : 'text-2xl text-gradient neon-gold'
            }`}>
              BHSamba
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            {menuItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative px-5 py-2.5 text-[#F5F5F5] hover:text-white font-medium transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#C5A059] to-[#F9C412] rounded-full group-hover:w-3/4 transition-all duration-300" />
              </a>
            ))}
            
            <a
              href="#contato"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#F9C412] text-black font-bold rounded-full hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 transform hover:scale-105"
            >
              Contratar
            </a>
          </div>

          <button
            className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-full glass hover:bg-[#C5A059]/20 transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <div className="relative w-6 h-5">
              <span className={`absolute left-0 w-full h-0.5 bg-[#C5A059] rounded-full transition-all duration-300 ${isOpen ? 'top-2.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-2.5 w-full h-0.5 bg-[#C5A059] rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
              <span className={`absolute left-0 w-full h-0.5 bg-[#C5A059] rounded-full transition-all duration-300 ${isOpen ? 'top-2.5 -rotate-45' : 'top-5'}`} />
            </div>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-[#C5A059]/20 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 py-3 px-4 text-[#F5F5F5] hover:text-[#C5A059] rounded-lg hover:bg-[#C5A059]/10 font-medium transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-base">{item.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#C5A059]/20">
              <a 
                href="#contato" 
                className="block w-full py-3 px-4 bg-gradient-to-r from-[#C5A059] to-[#F9C412] text-black font-bold text-center rounded-lg hover:shadow-lg hover:shadow-[#C5A059]/30 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Contratar Show
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}