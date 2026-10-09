import React, { useEffect, useState } from 'react';
import { TotemIcon } from './ThemeSwitch';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Smooth fast count from 0 to 100
    const start = performance.now();
    const duration = 1200; // ms

    const step = (time: number) => {
      const elapsed = time - start;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setProgress(100);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 400);
        }, 200);
      }
    };

    requestAnimationFrame(step);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-10 bg-[var(--_colors---background--bg,#dfdfdf)] text-black transition-opacity duration-400 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex justify-between items-start text-xs font-mono uppercase tracking-widest opacity-60">
        <div>bleibtgleich ‘26</div>
        <div>Kyiv / Global</div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="animate-pulse">
          <TotemIcon className="w-16 h-24 sm:w-20 sm:h-32 text-black" />
        </div>
        <div className="font-mono text-3xl sm:text-5xl font-bold tracking-tighter tabular-nums">
          {progress}%
        </div>
      </div>

      <div className="flex justify-between items-end text-xs font-mono uppercase tracking-widest opacity-60">
        <div>UX/UI &amp; Creative Dev</div>
        <div>Initialising folio...</div>
      </div>
    </div>
  );
};
