'use client';

import Image from 'next/image';
import { useEffect } from 'react';

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-xl animate-fade-in p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 w-14 h-14 rounded-full glass flex items-center justify-center text-[#C5A059] hover:text-[#F9C412] hover:bg-[#C5A059]/20 transition-all duration-300 z-50"
        onClick={onClose}
      >
        <span className="text-3xl">✕</span>
      </button>
      
      <div
        className="relative max-w-6xl max-h-[85vh] w-full h-full glass rounded-3xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full glass">
        <p className="text-[#F5F5F5]/60 text-sm">{alt}</p>
      </div>
    </div>
  );
}