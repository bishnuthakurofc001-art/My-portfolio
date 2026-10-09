import React, { useState } from 'react';
import { Project } from '../types';
import { InteractiveGlobe } from '../components/InteractiveGlobe';
import { sound } from '../utils/audio';
import { LayoutGrid, Globe as GlobeIcon, ArrowUpRight } from 'lucide-react';

interface WorkPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ projects, onSelectProject }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'globe'>('grid');
  const [filter, setFilter] = useState<'all' | 'Case' | 'Shot'>('all');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 max-w-[1920px] mx-auto space-y-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/15">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">
            Archive &amp; Case Studies
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter uppercase">
            Work
          </h1>
        </div>

        {/* Filters and View Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-full border border-black/15 bg-black/[0.04]">
            {(['all', 'Case', 'Shot'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setFilter(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-semibold transition-all ${
                  filter === cat
                    ? 'bg-black text-white'
                    : 'text-black/60 hover:text-black hover:bg-black/5'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full border border-black/15 bg-black/[0.04]">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('grid');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-black text-white shadow'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setViewMode('globe');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-semibold transition-all ${
                viewMode === 'globe'
                  ? 'bg-black text-white shadow'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
              title="3D Globe View"
            >
              <GlobeIcon className="w-3.5 h-3.5" />
              <span>Globe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Container */}
      {viewMode === 'globe' ? (
        <div className="space-y-4">
          <InteractiveGlobe
            projects={filteredProjects}
            onSelectProject={onSelectProject}
            height="75vh"
            autoRotate={false}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                sound.playClick();
                onSelectProject(project);
              }}
              onMouseEnter={() => sound.playHover()}
              className="group cursor-pointer flex flex-col justify-between rounded-3xl border border-black/15 bg-black/[0.02] p-4 sm:p-5 hover:border-black/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-black/10 bg-black/5 mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase">
                  {project.category}
                </div>
              </div>

              {/* Card Meta & Title */}
              <div className="flex items-end justify-between pt-2">
                <div>
                  <div className="text-xs font-mono opacity-50 mb-0.5">{project.year}</div>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight group-hover:text-black">
                    {project.title}
                  </h3>
                </div>

                <div className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
