'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  videoUrl?: string;
  imageUrl?: string;
  title: string;
  subtitle?: string;
}

export default function HeroSection({ videoUrl, imageUrl, title, subtitle }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#002776] via-[#1a0a2e] to-[#0a0a0a]" />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/20 rounded-full blur-[120px] animate-pulse"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#009B3A]/15 rounded-full blur-[150px] animate-pulse"
          style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`, animationDelay: '1s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B5CF6]/10 rounded-full blur-[200px]" />
      </div>
      
      <div className="absolute inset-0 bg-black/30" />
      
      <div 
        className={`relative z-10 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#C5A059]/30 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-72 h-72 md:w-96 md:h-96 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/40 to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <Image
              src="/Logo.png"
              alt="BHSamba"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        
        {subtitle && (
          <div className={`transition-all delay-500 duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative">
              <span className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent blur-lg animate-shimmer" />
              <p className="relative text-2xl md:text-4xl font-light text-[#F5F5F5] tracking-[0.3em] uppercase text-center">
                {subtitle}
              </p>
            </div>
          </div>
        )}
        
        <div className={`mt-16 flex flex-wrap justify-center gap-4 transition-all delay-700 duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a 
            href="#agenda" 
            className="group relative px-10 py-4 bg-gradient-to-r from-[#C5A059] to-[#F9C412] text-black font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#C5A059]/40"
          >
            <span className="relative z-10 flex items-center gap-2">
              🎤 Ver Shows
            </span>
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a 
            href="#contato" 
            className="group relative px-10 py-4 border-2 border-[#C5A059] text-[#C5A059] font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-[#F9C412] hover:text-[#F9C412]"
          >
            <span className="relative z-10 flex items-center gap-2">
              💼 Contratar
            </span>
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[#C5A059]/60 text-sm tracking-widest uppercase animate-pulse">Scroll</span>
        <div className="w-6 h-10 border-2 border-[#C5A059]/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#C5A059] rounded-full animate-bounce" />
        </div>
      </div>

      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '1s' }}>
          <a href="https://instagram.com/bhsamba" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#F5F5F5] hover:text-[#E4405F] hover:border-[#E4405F] transition-all duration-300 hover:scale-110">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://youtube.com/@bhsamba" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#F5F5F5] hover:text-[#FF0000] hover:border-[#FF0000] transition-all duration-300 hover:scale-110">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>

      </section>
  );
}