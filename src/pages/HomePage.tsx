import React from 'react';
import { Project, AwardYear, ThemeMode } from '../types';
import { InteractiveGlobe } from '../components/InteractiveGlobe';
import { ThemeSwitch, TotemIcon } from '../components/ThemeSwitch';
import { sound } from '../utils/audio';
import { ArrowUpRight } from 'lucide-react';

interface HomePageProps {
  projects: Project[];
  awards: AwardYear[];
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onSelectProject: (project: Project) => void;
  onNavigateToWork: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  awards,
  currentTheme,
  onSelectTheme,
  onSelectProject,
  onNavigateToWork,
}) => {
  return (
    <div className="space-y-24 sm:space-y-36 pt-24 sm:pt-32">
      {/* 1. HERO SECTION */}
      <section className="px-4 sm:px-8 max-w-[1920px] mx-auto">
        {/* Top meta tags */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-black/15 text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <TotemIcon className="w-6 h-10 text-black" />
            <div>
              <div className="font-bold">Maksym Bleibtgleich</div>
              <div className="opacity-50">Creative Developer</div>
            </div>
          </div>

          <div>
            <div className="opacity-50">Location</div>
            <div className="font-medium">Kyiv, Ukraine</div>
          </div>

          <div>
            <div className="opacity-50">Agency Collaboration</div>
            <a
              href="https://thefirstthelast.agency/?utm_source=bleibtgleich"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => sound.playHover()}
              className="font-medium inline-flex items-center gap-1 hover:underline"
            >
              <span>Working w/ TFTL</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>
          </div>

          <div className="flex justify-start md:justify-end">
            <ThemeSwitch currentTheme={currentTheme} onSelectTheme={onSelectTheme} />
          </div>
        </div>

        {/* Big Display Hero Typography */}
        <div className="pt-12 sm:pt-16 space-y-4">
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.9] select-none">
            <div>Design Digital</div>
            <div>Products, UX/UI</div>
            <div className="flex flex-wrap items-baseline gap-4 sm:gap-8">
              <span>&amp; Webflow dev.</span>
              <span className="text-xs sm:text-base font-mono font-normal tracking-normal border border-black/20 rounded-full px-4 py-1.5 align-middle self-center">
                EST. 2026
              </span>
            </div>
          </h1>

          <div className="pt-8 sm:pt-12 max-w-2xl">
            <p className="text-xl sm:text-3xl font-medium tracking-tight opacity-80 leading-snug">
              “the best ideas deserve execution.”
            </p>
          </div>
        </div>
      </section>

      {/* 2. FEATURED WORKS (3D GLOBE) */}
      <section className="px-4 sm:px-8 max-w-[1920px] mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-black/15">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">
              Curated Selection
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase">
              Work 24-26
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigateToWork();
            }}
            onMouseEnter={() => sound.playHover()}
            className="group flex items-center gap-2 text-sm sm:text-base font-mono uppercase font-semibold underline underline-offset-8 hover:opacity-75 transition-opacity"
          >
            <span>All Works ({projects.length})</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* 3D Three.js Globe of Works */}
        <InteractiveGlobe
          projects={projects}
          onSelectProject={onSelectProject}
          height="620px"
          autoRotate={true}
        />
      </section>

      {/* 3. AWARDS & RECOGNITIONS */}
      <section className="px-4 sm:px-8 max-w-[1920px] mx-auto space-y-12">
        <div className="pb-6 border-b border-black/15">
          <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">
            Industry Recognition
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase">
            Awards &amp; Recog-nitions
          </h2>
        </div>

        <div className="space-y-12">
          {awards.map((awardYear) => (
            <div
              key={awardYear.year}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-black/10"
            >
              {/* Year */}
              <div className="md:col-span-2">
                <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight">
                  {awardYear.year}
                </span>
              </div>

              {/* Projects & Accolades */}
              <div className="md:col-span-10 space-y-8">
                {awardYear.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="space-y-4">
                    <div className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
                      {proj.name}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {proj.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          onMouseEnter={() => sound.playHover()}
                          className="flex items-center justify-between p-4 rounded-xl border border-black/15 bg-black/[0.02] hover:bg-black hover:text-white transition-all duration-200 group font-mono text-xs"
                        >
                          <div>
                            <div className="font-bold text-sm">{item.organization}</div>
                            <div className="opacity-70 text-[11px] uppercase">
                              {item.title}
                            </div>
                          </div>
                          <span className="text-[10px] opacity-40 group-hover:opacity-100 group-hover:text-emerald-400">
                            VERIFIED
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
