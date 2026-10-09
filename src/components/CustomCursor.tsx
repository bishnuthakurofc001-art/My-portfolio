import React, { useEffect, useState, useRef } from 'react';

interface CustomCursorProps {
  cursorText?: string;
  cursorType?: string;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorText, cursorType }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const ringPos = useRef({ x: -100, y: -100 });
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    // Only show on devices with mouse
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, [data-link-trigger], [data-haptic], .works-item, .dial-item, .theme-switch');
        setIsHovered(!!interactive);
      }
    };

    const onMouseDown = () => setIsDown(true);
    const onMouseUp = () => setIsDown(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth lerp for ring
    const animateRing = () => {
      ringPos.current.x += (position.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (position.y - ringPos.current.y) * 0.22;
      reqRef.current = requestAnimationFrame(animateRing);
    };
    reqRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [position.x, position.y]);

  if (!isVisible) return null;

  const hasLabel = Boolean(cursorText);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Center dot */}
      <div
        className="fixed w-2 h-2 rounded-full bg-current transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isDown ? 0.6 : isHovered ? 1.5 : 1})`,
          color: 'var(--_colors---fill--primary, #111111)',
          display: hasLabel ? 'none' : 'block',
        }}
      />

      {/* Trailing follower ring */}
      <div
        className={`fixed flex items-center justify-center rounded-full border transition-all duration-200 pointer-events-none ${
          hasLabel ? 'bg-black text-white px-3 py-1.5 h-auto w-auto rounded-full' : ''
        }`}
        style={{
          left: `${ringPos.current.x}px`,
          top: `${ringPos.current.y}px`,
          transform: `translate(-50%, -50%) scale(${isDown ? 0.85 : isHovered ? 1.3 : 1})`,
          width: hasLabel ? 'auto' : isHovered ? '48px' : '32px',
          height: hasLabel ? 'auto' : isHovered ? '48px' : '32px',
          borderColor: 'var(--_colors---fill--primary, #111111)',
          backgroundColor: hasLabel ? 'var(--_colors---fill--primary, #111111)' : isHovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        }}
      >
        {cursorText && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--_colors---background--bg,#ffffff)] px-2 py-0.5 whitespace-nowrap">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
