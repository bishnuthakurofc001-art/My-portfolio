import React, { useState, useEffect } from 'react';
import { PageRoute, ThemeMode, Project } from './types';
import { PROJECTS, AWARDS, THEMES } from './data/portfolioData';
import { Navigation } from './components/Navigation';
import { SplitStickyName } from './components/SplitStickyName';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { Preloader } from './components/Preloader';
import { ProjectModal } from './components/ProjectModal';
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ContactPage } from './pages/ContactPage';
import { ArchivePage } from './pages/ArchivePage';
import { sound } from './utils/audio';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('base');
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync theme with html class and favicon
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;

    // Update favicon
    const currentThemeConfig = THEMES.find((t) => t.id === theme);
    if (currentThemeConfig?.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = currentThemeConfig.favicon;
    }
  }, [theme]);

  // Sync sound settings
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  // Scroll to top on navigation
  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen selection:bg-black selection:text-white transition-colors duration-500">
      {/* 1. Initial Preloader */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* 2. Custom Interactive Pointer Cursor */}
      <CustomCursor />

      {/* 3. Split Sticky Side Name Typography & Indicators */}
      <SplitStickyName />

      {/* 4. Navigation Header */}
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* 5. Main Content by Route */}
      <main className="relative z-20 min-h-screen">
        {currentPage === 'home' && (
          <HomePage
            projects={PROJECTS}
            awards={AWARDS}
            currentTheme={theme}
            onSelectTheme={setTheme}
            onSelectProject={setSelectedProject}
            onNavigateToWork={() => handleNavigate('work')}
          />
        )}

        {currentPage === 'work' && (
          <WorkPage
            projects={PROJECTS}
            onSelectProject={setSelectedProject}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            currentTheme={theme}
            onSelectTheme={setTheme}
          />
        )}

        {currentPage === 'archive' && (
          <ArchivePage />
        )}
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Modal Case Study Inspector */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

