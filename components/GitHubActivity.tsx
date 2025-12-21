
'use client';

import React, { useEffect, useState } from 'react';
import { Github, Star, ExternalLink, BookOpen, Globe, Loader2 } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  homepage: string;
  default_branch: string;
  fork: boolean;
}

interface EnhancedRepo extends Repo {
  readmeExcerpt?: string;
  previewImage?: string;
  vercelUrl?: string;
}

export const GitHubActivity: React.FC = () => {
  const [repos, setRepos] = useState<EnhancedRepo[]>([]);
  const [loading, setLoading] = useState(true);

  const extractDataFromMarkdown = (markdown: string) => {
    const mdImageMatch = markdown.match(/!\[.*?\]\((.*?)\)/);
    const htmlImageMatch = markdown.match(/<img.*?src=["'](.*?)["']/);
    const firstImage = mdImageMatch?.[1] || htmlImageMatch?.[1];

    const vercelMatch = markdown.match(/https?:\/\/[a-zA-Z0-9-]+\.vercel\.app[^\s)]*/);
    const vercelUrl = vercelMatch?.[0];

    let cleanText = markdown
      .replace(/#+.*?\n/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/<.*?>/g, '')
      .replace(/\n/g, ' ')
      .trim();
    
    const excerpt = cleanText.length > 120 ? cleanText.substring(0, 120) + "..." : cleanText;

    return { firstImage, vercelUrl, excerpt };
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for main fetch

        const res = await fetch('https://api.github.com/users/makhembu/repos?sort=updated&per_page=12&type=owner', { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const originalRepos = data.filter((r: Repo) => !r.fork).slice(0, 6);

          const enhancedResults = await Promise.allSettled(originalRepos.map(async (repo: Repo) => {
            try {
              const readmeController = new AbortController();
              const readmeTimeout = setTimeout(() => readmeController.abort(), 2000); // 2s timeout for each readme

              const readmeRes = await fetch(`https://raw.githubusercontent.com/makhembu/${repo.name}/${repo.default_branch}/README.md`, { signal: readmeController.signal });
              clearTimeout(readmeTimeout);
              
              if (readmeRes.ok) {
                const markdown = await readmeRes.text();
                const { firstImage, vercelUrl, excerpt } = extractDataFromMarkdown(markdown);
                const finalVercelUrl = (repo.homepage?.includes('vercel.app')) ? repo.homepage : vercelUrl;

                return {
                  ...repo,
                  readmeExcerpt: excerpt || repo.description,
                  previewImage: firstImage,
                  vercelUrl: finalVercelUrl
                };
              }
            } catch (e) {
              console.warn(`Could not fetch README for ${repo.name}`);
            }
            return { ...repo, readmeExcerpt: repo.description };
          }));

          const enhanced = enhancedResults.map(result => 
            result.status === 'fulfilled' ? result.value : (result as any).reason
          ).filter(Boolean);

          setRepos(enhanced);
        }
      } catch (error) {
        console.error("GitHub fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <Github className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size={20} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Connecting to Git...</span>
    </div>
  );

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600">Open Source / Labs</h2>
          <h3 className="font-display text-4xl md:text-5xl font-bold dark:text-white text-slate-900 tracking-tight leading-none">Latest Activity.</h3>
        </div>
        <a 
          href="https://github.com/makhembu" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
        >
          View GitHub Profile <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {repos.map(repo => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};

const RepoCard: React.FC<{ repo: EnhancedRepo }> = ({ repo }) => {
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const previewUrl = repo.vercelUrl 
    ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(repo.vercelUrl)}?w=800&h=600` 
    : repo.previewImage;

  return (
    <div className="group flex flex-col bg-white dark:bg-[#0d0e12] border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/40 transition-all duration-500 shadow-sm hover:shadow-2xl">
      <div className="relative h-52 bg-slate-100 dark:bg-white/[0.03] overflow-hidden shrink-0">
        {previewUrl ? (
          <div className="relative w-full h-full">
            {imgStatus === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-white/5">
                <Loader2 className="animate-spin text-slate-400" size={24} />
              </div>
            )}
            <img 
              src={previewUrl} 
              alt={repo.name} 
              onLoad={() => setImgStatus('loaded')}
              onError={() => setImgStatus('error')}
              className={`w-full h-full object-cover transition-all duration-700 ${imgStatus === 'loaded' ? 'grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100' : 'opacity-0'}`} 
            />
            {imgStatus === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100 dark:bg-white/5 gap-2">
                <BookOpen size={48} className="opacity-20" />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Documentation Only</span>
              </div>
            )}
            {repo.vercelUrl && imgStatus === 'loaded' && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg">
                <Globe size={10} /> Live Preview
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-white/10">
            <BookOpen size={64} className="group-hover:scale-110 transition-transform opacity-20" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
           <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/30 transition-all shadow-xl">
              <Github size={16} />
           </a>
        </div>
      </div>

      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-display font-bold text-xl dark:text-white text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {repo.name}
            </h4>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Star size={12} className="text-amber-500" /> {repo.stargazers_count}
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light line-clamp-3 italic min-h-[3.75rem]">
            {repo.readmeExcerpt || repo.description || "Project source code and documentation."}
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${repo.language ? 'bg-indigo-500' : 'bg-slate-400'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{repo.language || 'Module'}</span>
          </div>
          {repo.vercelUrl && (
            <a href={repo.vercelUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black uppercase text-emerald-500 hover:text-emerald-400 tracking-widest flex items-center gap-1">
              Visit Site <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
