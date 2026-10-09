import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';
import { ArrowUpRight, Copy, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [kyivTime, setKyivTime] = useState({ hours: '00', mins: '00', secs: '00' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Europe/Kyiv timezone (UTC+2 or UTC+3 during DST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Kyiv',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      const parts = formatter.formatToParts(now);
      const h = parts.find((p) => p.type === 'hour')?.value || '00';
      const m = parts.find((p) => p.type === 'minute')?.value || '00';
      const s = parts.find((p) => p.type === 'second')?.value || '00';

      setKyivTime({ hours: h, mins: m, secs: s });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText('hi.bleibtgleich@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="footer relative z-30 pt-24 pb-16 px-4 sm:px-8 border-t border-black/15 bg-transparent">
      <div className="max-w-[1920px] mx-auto space-y-16">
        {/* Poetic quote with embedded real-time live clock */}
        <div className="space-y-2 select-none">
          <div className="text-3xl sm:text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9]">
            <div>Everything</div>
            <div>that exists</div>
          </div>

          <div className="text-3xl sm:text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] pt-4">
            <div>had first</div>
            <div>existed as</div>
          </div>

          {/* Kyiv live Clock */}
          <div className="py-4 flex flex-wrap items-baseline gap-2 sm:gap-4 font-mono font-bold text-4xl sm:text-7xl md:text-9xl tracking-tighter tabular-nums">
            <span className="opacity-40">(</span>
            <span className="text-emerald-500">{kyivTime.hours}</span>
            <span className="opacity-40">)</span>
            <span className="opacity-40">:</span>
            <span>{kyivTime.mins}</span>
            <span className="opacity-40">:</span>
            <span className="text-xs sm:text-2xl font-mono self-center opacity-75">{kyivTime.secs}</span>
          </div>

          <div className="text-3xl sm:text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9]">
            <div>nothing more</div>
            <div>than a sentence.</div>
          </div>
        </div>

        {/* Contact and Links Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-black/15">
          {/* Availability */}
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider opacity-50">Status</div>
            <div className="text-xl sm:text-2xl font-semibold">Available for selected projects</div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>KYIV LOCAL TIME (UTC+3)</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider opacity-50">Write directly to</div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:hi.bleibtgleich@gmail.com?subject=[Project Inquiry] Hello, bleibtgleich!"
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                className="text-lg sm:text-2xl font-mono font-semibold underline underline-offset-4 hover:opacity-75 transition-opacity"
              >
                hi.bleibtgleich@gmail.com
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-full border border-black/15 hover:bg-black hover:text-white transition-colors text-xs"
                title="Copy email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider opacity-50">Network</div>
            <div className="flex flex-wrap gap-4 text-sm sm:text-base font-mono">
              <a
                href="https://www.linkedin.com/in/bleibtgleich/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>

              <a
                href="https://www.behance.net/bleibtgleich"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>Behance</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>

              <a
                href="https://www.instagram.com/bleibtgleich/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-mono opacity-50 pt-8 border-t border-black/10">
          <div>bleibtgleich ‘26 © All Right Reserved</div>
          <div>designed &amp; built w/ precision</div>
        </div>
      </div>
    </footer>
  );
};
