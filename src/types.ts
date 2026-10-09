/**
 * Portfolio types for bleibtgleich.dev
 */

export type ThemeMode = 'base' | 'mode-1' | 'mode-2' | 'mode-3' | 'mode-4';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  colorName: string;
  bg: string;
  text: string;
  fill: string;
  dotColor: string;
  accent: string;
  favicon: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'Case' | 'Shot';
  year: string;
  tagline: string;
  description: string;
  role: string[];
  tools: string[];
  image: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface AwardYear {
  year: string;
  projects: {
    name: string;
    items: {
      organization: string;
      title: string;
      link?: string;
    }[];
  }[];
}

export interface ExperimentMedia {
  id: string;
  title: string;
  tag: string;
  image: string;
  aspect?: string;
}

export type PageRoute = 'home' | 'work' | 'contact' | 'archive';
