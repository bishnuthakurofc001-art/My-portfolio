import React from 'react';
import { ThemeMode } from '../types';
import { RotaryDial } from '../components/RotaryDial';
import { sound } from '../utils/audio';
import { ArrowUpRight, Mail } from 'lucide-react';

interface ContactPageProps {
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-12">
      {/* Top Meta info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-black/15 text-xs font-mono uppercase tracking-wider">
        <div>
          <div className="opacity-50">Role</div>
          <div className="font-bold">UX/UI Designer &amp; Creative Dev</div>
        </div>

        <div>
          <div className="opacity-50">Headquarters</div>
          <div className="font-bold">Kyiv, Ukraine (GMT+3)</div>
        </div>

        <div>
          <div className="opacity-50">Direct Mail</div>
          <a
            href="mailto:hi.bleibtgleich@gmail.com?subject=[Project Inquiry] Hello, bleibtgleich!"
            className="font-bold underline underline-offset-4 hover:opacity-75"
          >
            hi.bleibtgleich@gmail.com
          </a>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase">
          Connect via Rotary
        </h1>
        <p className="text-sm sm:text-base font-mono opacity-70">
          Turn the dial wheel to change color modes, send direct mail, or explore network channels.
        </p>
      </div>

      {/* The Iconic Rotary Dial Phone */}
      <div className="py-4">
        <RotaryDial currentTheme={currentTheme} onSelectTheme={onSelectTheme} />
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-black/15">
        <a
          href="mailto:hi.bleibtgleich@gmail.com?subject=[Project Inquiry] Hello, bleibtgleich!"
          onClick={() => sound.playClick()}
          className="p-6 rounded-2xl border border-black/15 bg-black/[0.02] hover:bg-black hover:text-white transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <Mail className="w-5 h-5" />
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <div className="text-xs font-mono uppercase opacity-60">Inquiry Mail</div>
          <div className="text-lg font-mono font-bold">hi.bleibtgleich@gmail.com</div>
        </a>

        <a
          href="https://www.linkedin.com/in/bleibtgleich/"
          target="_blank"
          rel="noreferrer"
          onClick={() => sound.playClick()}
          className="p-6 rounded-2xl border border-black/15 bg-black/[0.02] hover:bg-black hover:text-white transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold uppercase">LinkedIn</span>
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <div className="text-xs font-mono uppercase opacity-60">Professional Profile</div>
          <div className="text-lg font-mono font-bold">@bleibtgleich</div>
        </a>

        <a
          href="https://www.instagram.com/bleibtgleich/"
          target="_blank"
          rel="noreferrer"
          onClick={() => sound.playClick()}
          className="p-6 rounded-2xl border border-black/15 bg-black/[0.02] hover:bg-black hover:text-white transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs font-bold uppercase">Instagram</span>
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <div className="text-xs font-mono uppercase opacity-60">Visual Journal</div>
          <div className="text-lg font-mono font-bold">@bleibtgleich</div>
        </a>
      </div>
    </div>
  );
};
