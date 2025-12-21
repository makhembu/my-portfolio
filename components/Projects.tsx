
'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/portfolioData';
import { ExternalLink, Github, ArrowRight, Loader2, Globe } from 'lucide-react';
import { GitHubActivity } from './GitHubActivity';

/**
 * ProjectImage - Displays project screenshot with gradient fallback
 * Shows gradient background immediately, overlays image when loaded
 * Falls back gracefully if image fails to load
 * 
 * @param src - Image URL for project screenshot
 * @param projectId - Project ID for consistent gradient generation
 * @param title - Project name for alt text and accessibility
 * @returns Image component with gradient fallback
 */
const ProjectImage: React.FC<{ src: string; projectId: string; title: string }> = ({ src, projectId, title }) => {
  const [loaded, setLoaded] = useState(false);
  
  // Generate consistent gradient based on project ID
  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
  ];
  const gradient = gradients[projectId.charCodeAt(0) % gradients.length];

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${gradient} overflow-hidden`}>
      {/* Gradient fallback background with pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1))] bg-[length:40px_40px]" />
      </div>

      {/* Loading spinner - only show briefly */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20">
          <Loader2 className="animate-spin text-white/50" size={24} />
          <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Loading</span>
        </div>
      )}

      {/* Actual screenshot image - overlays gradient */}
      <img 
        src={src} 
        alt={title} 
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? 'grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100' : 'opacity-0'
        }`} 
        loading="lazy"
      />
    </div>
  );
};

/**
 * Projects - Showcase portfolio projects with category-based filtering
 * Displays project cards with images, descriptions, tech tags, and links
 * Supports filtering by category: all, code, infra, translation
 * 
 * Features:
 * - Dynamic project filtering
 * - Responsive grid layout (1 to 3 columns)
 * - Active tab highlighting
 * - Project card hover effects
 * - Tech stack tags
 * - External links to live sites and repos
 * 
 * @returns Projects portfolio section with filter controls
 */
export const Projects: React.FC = () => {
  const [filter, setFilter] = React.useState('all');
  
  const filtered = filter === 'all' 
    ? portfolioData.projects 
    : portfolioData.projects.filter(p => p.category === filter);

  const tabs = ['all', 'code', 'infra', 'translation'];

  return (
    <div id="projects-section" className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-32">
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Kazi / Proof of Competence</h2>
            <h3 className="font-display text-4xl md:text-5xl font-bold dark:text-white text-slate-900 leading-tight">Featured Work.</h3>
          </div>
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 overflow-x-auto scrollbar-hide">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 md:px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === t ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filtered.map(project => (
            <div key={project.id} className="group flex flex-col h-full bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/40 transition-all duration-500 shadow-sm hover:shadow-xl">
              <div className="relative h-56 md:h-64 overflow-hidden shrink-0">
                <ProjectImage src={project.imageUrl || ''} projectId={project.id} title={project.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                   <div className="space-y-1">
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">Ownership</p>
                      <p className="text-indigo-300 text-xs italic">Personal lead on architecture & deployment</p>
                   </div>
                </div>
              </div>
              <div className="p-8 space-y-6 flex flex-col flex-1">
                <div className="space-y-4">
                  <h4 className="font-display text-2xl font-bold dark:text-white text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{project.title}</h4>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                    {project.description}
                  </p>

                  {/* Display metrics if available */}
                  {project.metrics && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-[8px] font-black uppercase text-indigo-500 tracking-widest opacity-70">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm font-bold dark:text-white text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-6 flex gap-3 border-t border-slate-100 dark:border-white/5">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                      <Github size={14} /> GitHub Repo
                    </a>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-all" title="View Live Site">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <GitHubActivity />
    </div>
  );
};
