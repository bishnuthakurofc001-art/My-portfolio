import React from 'react';
import { EXPERIMENTS } from '../data/portfolioData';
import { InfiniteCanvas } from '../components/InfiniteCanvas';

export const ArchivePage: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/15">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">
            Laboratory &amp; R&amp;D
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter uppercase">
            Experiments
          </h1>
        </div>
        <div className="text-xs font-mono opacity-60">
          Interactive Canvas — Drag freely to pan
        </div>
      </div>

      <InfiniteCanvas experiments={EXPERIMENTS} />
    </div>
  );
};
