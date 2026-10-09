import React from 'react';
import { Project } from '../types';
import { sound } from '../utils/audio';
import { X, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      onClick={() => {
        sound.playClick();
        onClose();
      }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-[var(--_colors---background--bg,#dfdfdf)] text-black rounded-3xl p-6 sm:p-10 border border-black/20 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider opacity-60 mb-2">
          <span>{project.category}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter uppercase mb-4">
          {project.title}
        </h2>

        {/* Hero Image */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-black/15 mb-8 bg-black/5">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">
              Overview
            </h4>
            <p className="text-lg sm:text-xl font-medium leading-relaxed mb-4">
              {project.tagline}
            </p>
            <p className="text-sm sm:text-base opacity-80 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">
                Scope &amp; Role
              </h4>
              <ul className="space-y-1.5 text-xs font-mono">
                {project.role.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider opacity-50 mb-2">
                Tools &amp; Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full border border-black/15 text-[11px] font-mono bg-black/5"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono opacity-50">
            bleibtgleich ‘26 — curated case
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
