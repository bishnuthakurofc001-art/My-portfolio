import React, { useState } from 'react';
import { PageRoute } from '../types';
import { sound } from '../utils/audio';
import { Volume2, VolumeX } from 'lucide-react';

interface NavigationProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  soundEnabled,
  onToggleSound,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { id: PageRoute; label: string; num: string }[] = [
    { id: 'home', label: 'Home', num: '1' },
    { id: 'work', label: 'Work', num: '2' },
    { id: 'contact', label: 'Contact', num: '3' },
    { id: 'archive', label: 'Experiments', num: '*' },
  ];

  const handleNavClick = (page: PageRoute) => {
    sound.playClick();
    onNavigate(page);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    sound.playHover();
  };

  return (
    <nav className="nav fixed top-0 left-0 w-full z-50 pointer-events-none p-4 md:p-6">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left side brand or location tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            onMouseEnter={handleMouseEnter}
            className="group text-left text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100 transition-opacity"
            title="bleibtgleich"
          >
            <span>bleibtgleich</span>
            <span className="hidden sm:inline opacity-50 ml-2">‘26</span>
          </button>
        </div>

        {/* Center / Right Nav Menu */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            onMouseEnter={handleMouseEnter}
            className="w-9 h-9 rounded-full border border-black/15 dark:border-white/15 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs"
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-50" />
            )}
          </button>

          {/* Nav Container */}
          <div className="relative flex items-center">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center bg-[var(--_colors---background--bg,#dfdfdf)]/90 backdrop-blur-md border border-black/10 rounded-full px-2 py-1 shadow-sm">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={handleMouseEnter}
                    className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all group overflow-hidden ${
                      isActive
                        ? 'text-white bg-black'
                        : 'text-black/70 hover:text-black hover:bg-black/5'
                    }`}
                  >
                    <span className="text-[11px] opacity-60">{item.num}</span>
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                sound.playClick();
                setIsOpen(!isOpen);
              }}
              onMouseEnter={handleMouseEnter}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-[var(--_colors---background--bg,#dfdfdf)]/90 backdrop-blur-md text-xs uppercase tracking-wider font-medium shadow-sm active:scale-95 transition-transform"
            >
              <span>{isOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-3 p-4 bg-[var(--_colors---background--bg,#dfdfdf)]/98 backdrop-blur-xl border border-black/10 rounded-2xl shadow-xl pointer-events-auto flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-medium transition-colors ${
                  isActive ? 'bg-black text-white' : 'hover:bg-black/5 text-black'
                }`}
              >
                <span className="text-base">{item.label}</span>
                <span className="text-xs opacity-50">[{item.num}]</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
