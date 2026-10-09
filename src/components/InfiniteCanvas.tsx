import React, { useRef, useState, useEffect } from 'react';
import { ExperimentMedia } from '../types';
import { sound } from '../utils/audio';
import { Move, ZoomIn, X } from 'lucide-react';

interface InfiniteCanvasProps {
  experiments: ExperimentMedia[];
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ experiments }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: -100, y: -50 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedExp, setSelectedExp] = useState<ExperimentMedia | null>(null);

  const dragStart = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { ...offset };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffset({
        x: startOffset.current.x + dx,
        y: startOffset.current.y + dy,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  // Layout items across a virtual canvas coordinate space
  const itemsWithCoords = experiments.map((exp, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    // Stagger slightly for organic editorial layout
    const x = col * 360 + (row % 2 === 1 ? 80 : 0);
    const y = row * 400 + (col % 2 === 1 ? 40 : 0);
    return { ...exp, x, y };
  });

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={`relative w-full h-[78vh] overflow-hidden border border-black/15 rounded-3xl select-none bg-black/[0.02] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Draggable world stage */}
      <div
        className="absolute transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        }}
      >
        {itemsWithCoords.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              setSelectedExp(item);
            }}
            className="absolute w-[280px] sm:w-[320px] group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-30"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
            }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-black/15 bg-black/5 shadow-md aspect-[4/5]">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" />
                  INSPECT
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono">
              <span className="font-semibold">{item.title}</span>
              <span className="opacity-50 text-[10px] uppercase">[{item.tag}]</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Canvas UI Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider flex items-center gap-2">
          <Move className="w-3.5 h-3.5 text-emerald-400" />
          <span>DRAG CANVAS FREELY TO EXPLORE EXPERIMENTS</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setOffset({ x: 0, y: 0 });
          }}
          className="pointer-events-auto bg-[var(--_colors---background--bg,#dfdfdf)] text-black px-3.5 py-1.5 rounded-full text-xs font-mono border border-black/15 shadow hover:bg-black hover:text-white transition-colors"
        >
          RESET VIEW
        </button>
      </div>

      {/* Detail Modal */}
      {selectedExp && (
        <div
          onClick={() => setSelectedExp(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-default"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-[var(--_colors---background--bg,#dfdfdf)] rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden"
          >
            <button
              onClick={() => setSelectedExp(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-black/10 mb-4 bg-black">
              <img
                src={selectedExp.image}
                alt={selectedExp.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between font-mono">
              <div>
                <h3 className="text-xl font-bold uppercase">{selectedExp.title}</h3>
                <p className="text-xs opacity-60">Archive Experiment — Category: {selectedExp.tag}</p>
              </div>
              <span className="text-xs px-3 py-1 bg-black text-white rounded-full">
                {selectedExp.tag}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
