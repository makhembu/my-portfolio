'use client';

import React, { useState, useEffect } from 'react';
import { portfolioData } from '@/portfolioData';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useAppContext';

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  homepage: string;
  description: string;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  githubUrl?: string;
  vercelUrl?: string;
  tags: string[];
}

// Gradient palette for project fallback backgrounds
const GRADIENT_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-pink-600',
] as const;

/**
 * Get consistent gradient for a project ID
 * Uses hash of ID for deterministic color selection
 */
function getProjectGradient(projectId: string): string {
  const index = projectId.charCodeAt(0) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index];
}

interface ProjectImageProps {
  projectId: string;
  vercelUrl?: string;
  title: string;
}

const ProjectImage: React.FC<ProjectImageProps> = ({ projectId, vercelUrl, title }) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const gradient = getProjectGradient(projectId);
  
  // Use mshots to generate live preview from Vercel URL (same as GitHubActivity)
  const previewUrl = vercelUrl 
    ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(vercelUrl)}?w=800&h=600`
    : null;

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${gradient} overflow-hidden group`}>
      {previewUrl ? (
        <div className="relative w-full h-full">
          {imgStatus === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
              <Loader2 className="animate-spin text-white/50" size={24} />
            </div>
          )}
          <img 
            src={previewUrl} 
            alt={title}
            onLoad={() => setImgStatus('loaded')}
            onError={() => setImgStatus('error')}
            className={`w-full h-full object-cover transition-all duration-700 ${imgStatus === 'loaded' ? 'grayscale group-hover:grayscale-0 opacity-85 group-hover:opacity-100' : 'opacity-0'}`}
          />
          {imgStatus === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-2">
              <div className="text-lg font-bold text-white/80 text-center px-4">{title}</div>
              <p className="text-[10px] font-light uppercase tracking-widest text-white/50">Live Project</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h4 className="text-white/80 text-lg md:text-xl font-bold tracking-tight group-hover:text-white transition-colors">{title}</h4>
          <p className="text-white/50 text-[11px] mt-2 font-light uppercase tracking-widest group-hover:text-white/70 transition-colors">Live Project</p>
        </div>
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: ProjectData;
}

/**
 * ProjectCard Component
 * Individual project card with image, details, and action links
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group flex flex-col h-full bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/40 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1">
      {/* Project Image Section */}
      <div className="relative h-56 md:h-64 overflow-hidden shrink-0">
        <ProjectImage 
          projectId={project.id} 
          vercelUrl={project.vercelUrl}
          title={project.title} 
        />
        
        {/* Ownership Badge - appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black to-transparent p-6">
          <div className="space-y-1">
            <p className="text-white text-[10px] font-black uppercase tracking-widest">Live Project</p>
            <p className="text-indigo-300 text-xs font-light">Click to explore</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-6 flex flex-col flex-1">
        {/* Title and Description */}
        <div className="space-y-4">
          <h3 className="font-display text-2xl font-bold dark:text-white text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors duration-300">
            {project.title}
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span 
                key={tag} 
                className="text-[8px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/50 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 mt-auto flex gap-3 border-t border-slate-100 dark:border-white/5">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`View ${project.title} GitHub repository`}
              className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-200 shadow-sm"
            >
              <Github size={14} />
              <span>Code</span>
            </a>
          )}
          {project.vercelUrl && (
            <a 
              href={project.vercelUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`Visit ${project.title} live site`}
              className="p-3 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Projects Section Component
 * Fetches featured projects from GitHub API (matching GitHubActivity approach)
 * Displays live previews via mshots screenshot service
 */
export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Use portfolio data directly for featured projects
  useEffect(() => {
    setProjects(portfolioData.projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      githubUrl: p.githubUrl,
      vercelUrl: p.link,
      tags: p.tags,
    })));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-24">
        <div className="flex justify-center items-center gap-4 py-20">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <Github className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Projects...</span>
        </div>
      </section>
    );
  }

  const categoryLabels = {
    all: 'All Projects',
    code: 'Software',
    infra: 'Infrastructure',
    translation: 'Localization',
  };

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const filterCategories = Object.keys(categoryLabels) as (keyof typeof categoryLabels)[];

  return (
    <section id="projects-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-24 space-y-12 md:space-y-16 overflow-hidden">
      {/* Section Header */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
            {t('projectsSubtitle')}
          </h2>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold dark:text-white text-slate-900 leading-tight tracking-tight">
            {t('sectionProjects')}
          </h1>
        </div>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl font-light leading-relaxed">
          {t('projectsDescription')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 lg:gap-2">
        {filterCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 md:px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
              activeFilter === category
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};
