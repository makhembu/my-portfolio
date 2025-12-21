
'use client';

import React from 'react';
import { portfolioData } from '@/portfolioData';
import { GraduationCap, MapPin, Zap, Database, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/context';

/**
 * SummaryRenderer - Parses and renders markdown-style links in text
 * Converts [label](url) syntax to accessible anchor tags
 * 
 * @param text - Text containing markdown links: [label](url)
 * @returns Rendered elements with parsed links
 * 
 * @example
 * <SummaryRenderer text="Check [my GitHub](https://github.com)" />
 */
const SummaryRenderer: React.FC<{ text: string }> = ({ text }) => {
  const segments = text.split(/(\[.*?\]\(.*?\))/g);
  return (
    <>
      {segments.map((segment, i) => {
        const linkMatch = segment.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [_, label, url] = linkMatch;
          return (
            <a 
              key={i} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all"
            >
              {label}
            </a>
          );
        }
        return <span key={i}>{segment}</span>;
      })}
    </>
  );
};

/**
 * About - Displays comprehensive profile information and technical expertise
 * Features personal identity, education, location, and technical pillars
 * Uses portfolio data structure for consistency across the application
 * 
 * @returns About section component with responsive grid layout
 */
export const About: React.FC = () => {
  const { lang, t } = useLanguage();
  // Use IT variant as default for About section
  const profileVariant = portfolioData.profile.variants.it;
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600">{t('sectionIdentity')}</h2>
            <h3 className="font-display text-6xl font-bold text-slate-900 dark:text-white tracking-tight">{t('aboutTitle')}.</h3>
          </div>
          <div className="text-xl font-light leading-relaxed text-slate-600 dark:text-slate-400">
            <SummaryRenderer text={profileVariant.summary} />
          </div>
          <p className="text-lg text-slate-500 italic">
            "My dual expertise as an engineer and a linguist allows me to approach problems from both a logical and a human perspective, at a global scale."
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Experience</div>
              <p className="text-base font-bold dark:text-white">6+ Years</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Alumni</div>
              <p className="text-sm font-bold dark:text-white flex items-center gap-2"><GraduationCap size={16}/> JKUAT</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Base</div>
              <p className="text-sm font-bold dark:text-white flex items-center gap-2"><MapPin size={16}/> {portfolioData.profile.location}</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Role</div>
              <p className="text-sm font-bold dark:text-white truncate">{profileVariant.role}</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-[3rem] -rotate-3"></div>
          <div className="relative bg-white dark:bg-[#0d0e12] border border-slate-200 dark:border-white/5 p-12 rounded-[3rem] shadow-2xl space-y-12">
            <h4 className="font-display text-2xl font-bold text-indigo-600">Technical Pillar</h4>
            <div className="grid gap-8">
              <div className="flex gap-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 h-fit"><Zap size={24}/></div>
                <div>
                  <p className="font-bold mb-1">High-Performance Frontend</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Deep focus on Next.js, state management strategies, and web vitals optimization for global users.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600 h-fit"><Database size={24}/></div>
                <div>
                  <p className="font-bold mb-1">Resilient Backend Systems</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Designing type-safe APIs with Node.js and building scalable data models in PostgreSQL.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-600 h-fit"><Globe size={24}/></div>
                <div>
                  <p className="font-bold mb-1">Cultural Localization</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Expert Swahili translation and UI/UX adaptation for international markets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
