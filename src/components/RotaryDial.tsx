import React, { useState, useRef, useEffect } from 'react';
import { ThemeMode } from '../types';
import { sound } from '../utils/audio';
import { Mail, Instagram, Linkedin, Globe } from 'lucide-react';

interface RotaryDialProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

interface DialItem {
  type: 'theme' | 'link';
  themeId?: ThemeMode;
  label: string;
  angle: number; // degrees from top
  color?: string;
  icon?: React.ReactNode;
  url?: string;
}

export const RotaryDial: React.FC<RotaryDialProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('DRAG TO DIAL OR CLICK');

  // Ref tracking drag state
  const dragStartAngle = useRef(0);
  const currentRotation = useRef(0);
  const prevTickAngle = useRef(0);
  const animFrameId = useRef<number | null>(null);

  // The 9 holes on the dial
  const dialItems: DialItem[] = [
    { type: 'theme', themeId: 'mode-1', label: 'Concrete', angle: 30, color: '#b4b7c0' },
    { type: 'theme', themeId: 'mode-3', label: 'Verdigris', angle: 0, color: '#8a9641' },
    { type: 'theme', themeId: 'mode-2', label: 'Rust', angle: 330, color: '#f25e3a' },
    { type: 'theme', themeId: 'base', label: 'Default', angle: 300, color: '#dfdfdf' },
    {
      type: 'link',
      label: 'Mail',
      angle: 270,
      icon: <Mail className="w-4 h-4" />,
      url: 'mailto:hi.bleibtgleich@gmail.com?subject=[Project Inquiry] Hello, bleibtgleich!',
    },
    { type: 'theme', themeId: 'mode-4', label: 'Blood', angle: 240, color: '#b41d23' },
    {
      type: 'link',
      label: 'Instagram',
      angle: 210,
      icon: <Instagram className="w-4 h-4" />,
      url: 'https://www.instagram.com/bleibtgleich',
    },
    {
      type: 'link',
      label: 'LinkedIn',
      angle: 180,
      icon: <Linkedin className="w-4 h-4" />,
      url: 'https://www.linkedin.com/in/bleibtgleich/',
    },
    {
      type: 'link',
      label: 'Behance',
      angle: 150,
      icon: <Globe className="w-4 h-4" />,
      url: 'https://www.behance.net/bleibtgleich',
    },
  ];

  // Helper to calculate mouse angle relative to dial center
  const getAngleFromCenter = (clientX: number, clientY: number): number => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let angleRad = Math.atan2(dy, dx); // -PI to PI
    let deg = (angleRad * 180) / Math.PI;
    return (deg + 360) % 360;
  };

  const handlePointerDown = (e: React.PointerEvent, item: DialItem) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDraggedItem(item.label);
    setStatusMessage(`DIALING ${item.label.toUpperCase()}`);

    const angle = getAngleFromCenter(e.clientX, e.clientY);
    dragStartAngle.current = angle;
    currentRotation.current = 0;
    prevTickAngle.current = 0;
    sound.playClick();
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const angle = getAngleFromCenter(e.clientX, e.clientY);
      let diff = angle - dragStartAngle.current;

      // Handle wraparound
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      // Allow clockwise rotation up to 210 degrees
      const newRot = Math.max(0, Math.min(210, diff));
      currentRotation.current = newRot;
      setRotation(newRot);

      // Play tick every 20 degrees of rotation
      if (Math.abs(newRot - prevTickAngle.current) > 18) {
        sound.playTick(500 + newRot * 2);
        prevTickAngle.current = newRot;
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      // Check if dialed sufficiently (more than 40 deg) or trigger item
      const item = dialItems.find((d) => d.label === draggedItem);
      if (item) {
        if (item.type === 'theme' && item.themeId) {
          onSelectTheme(item.themeId);
          sound.playClick();
          setStatusMessage(`THEME: ${item.label.toUpperCase()}`);
        } else if (item.type === 'link' && item.url) {
          sound.playClick();
          window.open(item.url, '_blank');
          setStatusMessage(`OPENED ${item.label.toUpperCase()}`);
        }
      }

      // Spring back to 0 with inertia animation
      let startRot = currentRotation.current;
      const startTime = performance.now();
      const duration = 500;

      const springBack = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Spring easing
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentRot = startRot * (1 - ease);

        setRotation(currentRot);
        currentRotation.current = currentRot;

        if (progress < 1) {
          animFrameId.current = requestAnimationFrame(springBack);
        } else {
          setRotation(0);
          currentRotation.current = 0;
          setDraggedItem(null);
          setTimeout(() => setStatusMessage('DRAG TO DIAL OR CLICK'), 1500);
        }
      };

      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      animFrameId.current = requestAnimationFrame(springBack);
    };

    if (isDragging) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isDragging, draggedItem, onSelectTheme]);

  const handleDirectClick = (item: DialItem) => {
    sound.playClick();
    if (item.type === 'theme' && item.themeId) {
      onSelectTheme(item.themeId);
      setStatusMessage(`THEME: ${item.label.toUpperCase()}`);
    } else if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank');
      setStatusMessage(`OPENED ${item.label.toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center select-none py-8">
      {/* Dial Main Box */}
      <div
        ref={dialRef}
        className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full flex items-center justify-center p-4 border border-black/15 shadow-2xl bg-[var(--_colors---background--bg,#dfdfdf)] touch-none"
      >
        {/* Base Layer: Static dial icons / theme circles behind holes */}
        <div className="absolute inset-0 pointer-events-none">
          {dialItems.map((item, index) => {
            // Polar coordinates for radius ~36% of container
            const rad = (item.angle * Math.PI) / 180;
            const rPercent = 38;
            const x = 50 + rPercent * Math.cos(rad);
            const y = 50 + rPercent * Math.sin(rad);

            const isCurrent = item.type === 'theme' && item.themeId === currentTheme;

            return (
              <div
                key={index}
                className="absolute w-12 h-12 sm:w-14 sm:h-14 -ml-6 -mt-6 sm:-ml-7 sm:-mt-7 rounded-full flex items-center justify-center border border-black/20 transition-all duration-300 pointer-events-auto cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  backgroundColor: item.color || 'var(--_colors---background--bg, #dfdfdf)',
                }}
                onClick={() => handleDirectClick(item)}
                title={`Dial ${item.label}`}
              >
                {item.icon ? (
                  <div className="text-black/80">{item.icon}</div>
                ) : (
                  <span
                    className={`w-3 h-3 rounded-full border border-black/40 ${
                      isCurrent ? 'ring-2 ring-black scale-125' : ''
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Rotating Wheel Overlay (Finger plate with cut-out holes) */}
        <div
          className="absolute inset-4 rounded-full border-2 border-black/30 shadow-inner transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {dialItems.map((item, index) => {
            const rad = (item.angle * Math.PI) / 180;
            const rPercent = 38;
            const x = 50 + rPercent * Math.cos(rad);
            const y = 50 + rPercent * Math.sin(rad);

            return (
              <div
                key={index}
                onPointerDown={(e) => handlePointerDown(e, item)}
                className="absolute w-12 h-12 sm:w-14 sm:h-14 -ml-6 -mt-6 sm:-ml-7 sm:-mt-7 rounded-full border-2 border-black/50 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  background: 'radial-gradient(circle, transparent 65%, rgba(0,0,0,0.12) 100%)',
                }}
              />
            );
          })}
        </div>

        {/* Mechanical Stopper Bar at bottom right */}
        <div
          className="absolute right-7 bottom-12 w-8 h-2 bg-black/80 rounded-sm transform rotate-45 shadow pointer-events-none z-10"
          title="Finger stopper"
        />

        {/* Center Station Disc */}
        <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[var(--_colors---background--bg,#dfdfdf)] border-2 border-black/40 flex flex-col items-center justify-center text-center p-2 shadow-lg pointer-events-none">
          <div className="text-[10px] font-mono uppercase tracking-widest opacity-60">KYIV-026</div>
          <div className="text-base sm:text-lg font-bold tracking-tighter uppercase my-0.5">
            bleibtgleich
          </div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
            AVAILABLE
          </div>
        </div>
      </div>

      {/* Dial status message */}
      <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-black/5 text-xs font-mono tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-black/60 animate-ping" />
        <span>{statusMessage}</span>
      </div>
    </div>
  );
};
