'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
}

interface VoiceMessage {
  id: string;
  senderPhone: string;
  senderName: string | null;
  audioUrl: string;
  duration: number | null;
  status: string;
  memberId: string | null;
  createdAt: string;
  member: Member | null;
}

interface VoicMailSectionProps {
  messages: VoiceMessage[];
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function AudioPlayer({ audioUrl, duration }: { audioUrl: string; duration: number | null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    audio.currentTime = newTime;
  };

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#009B3A] to-[#007A2E] flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white" fill="white" />
        ) : (
          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
        )}
      </button>

      <div className="flex-1">
        <div
          className="h-2 bg-black/30 rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-[#C5A059] to-[#F9C412] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/60">{formatDuration(currentTime)}</span>
          <span className="text-xs text-white/60">{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function VoicMailSection({ messages }: VoicMailSectionProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Volume2 className="w-16 h-16 text-[#C5A059]/30 mx-auto mb-4" />
        <p className="text-white/60 text-lg">Nenhum recado publicado ainda.</p>
        <p className="text-white/40 text-sm mt-2">Envie um recado de voz pelo WhatsApp!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-[#C5A059]/20 rounded-2xl p-5 hover:border-[#C5A059]/40 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {msg.member?.imageUrl ? (
                <img
                  src={msg.member.imageUrl}
                  alt={msg.member.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A059]/50"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C5A059] to-[#F9C412] flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">
                    {(msg.member?.name || msg.senderName || '?')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {msg.member?.name || msg.senderName || 'Desconhecido'}
                  </h3>
                  {msg.member?.role && (
                    <p className="text-[#C5A059] text-sm">{msg.member.role}</p>
                  )}
                </div>
                <span className="text-white/40 text-xs">{formatDate(msg.createdAt)}</span>
              </div>

              <AudioPlayer audioUrl={msg.audioUrl} duration={msg.duration} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
