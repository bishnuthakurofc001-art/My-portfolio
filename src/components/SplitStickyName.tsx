import React, { useEffect, useState } from 'react';

export const SplitStickyName: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalScroll) * 100)));
        setScrollProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside aria-hidden="true" className="sticky-name pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* Top Bar Indicators */}
      <div className="flex justify-between items-start text-xs font-mono tracking-widest opacity-40">
        <div className="tabular-nums font-semibold">{scrollProgress}%</div>
        <div className="hidden sm:block">KYIV — UTC+3</div>
      </div>

      {/* Middle massive split typography */}
      <div className="flex-1 flex items-center justify-between w-full select-none">
        {/* Left Name Part */}
        <div className="writing-mode-vertical-rl rotate-180 -ml-2 sm:-ml-1 opacity-8 transition-opacity duration-300 pointer-events-none font-bold tracking-tighter text-[11vw] sm:text-[9vw] leading-none uppercase select-none">
          bleibt
        </div>

        {/* Right Name Part */}
        <div className="writing-mode-vertical-rl -mr-2 sm:-mr-1 opacity-8 transition-opacity duration-300 pointer-events-none font-bold tracking-tighter text-[11vw] sm:text-[9vw] leading-none uppercase select-none">
          gleich
        </div>
      </div>

      {/* Bottom Bar Indicators */}
      <div className="flex justify-between items-end text-[11px] uppercase tracking-wider opacity-40 font-mono">
        <div>‘26 © All Right Reserved</div>
        <div>made w/ hate</div>
      </div>
    </aside>
  );
};
