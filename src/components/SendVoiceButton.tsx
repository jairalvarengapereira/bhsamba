'use client';

import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface SendVoiceButtonProps {
  phoneNumber: string;
}

export default function SendVoiceButton({ phoneNumber }: SendVoiceButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const message = encodeURIComponent(
      'Olá! Estou enviando um recado de voz para o Mural do BHSamba! 🎵🎤'
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 left-8 z-50 group"
      aria-label="Enviar recado de voz"
    >
      <div className="absolute inset-0 bg-[#C5A059] rounded-full animate-ping opacity-50" />

      <div className="relative">
        <div className={`w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isHovered
            ? 'bg-gradient-to-br from-[#C5A059] to-[#F9C412] scale-110 shadow-[0_0_40px_rgba(197,160,89,0.5)]'
            : 'bg-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.3)]'
        }`}>
          <Mic className="w-8 h-8 md:w-9 md:h-9 text-black drop-shadow-lg" />
        </div>

        {isHovered && (
          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 animate-slide-up">
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-[#C5A059]/30">
              <p className="text-white font-bold text-sm whitespace-nowrap flex items-center gap-2">
                <span className="w-3 h-3 bg-[#C5A059] rounded-full animate-pulse" />
                Envie seu recado!
              </p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
