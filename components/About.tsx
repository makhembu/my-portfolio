
'use client';

import React from 'react';
import { portfolioData } from '@/portfolioData';
import { GraduationCap, MapPin, Zap, Database, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useAppContext';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 space-y-16 md:space-y-32 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-600">{t('sectionIdentity')}</h2>
            <h3 className="font-display text-6xl font-bold text-slate-900 dark:text-white tracking-tight">{t('aboutTitle')}.</h3>
          </div>
          <div className="text-xl font-light leading-relaxed text-slate-600 dark:text-slate-400">
            <SummaryRenderer text={lang === 'sw' ? t('dualExpertise') : "I've worked in infrastructure, support, development, and translation. That range gives me perspective. I see technical problems through the lens of the humans who need to use the solution. And I see language barriers as UX problems to solve, not just text to convert."} />
          </div>
          <p className="text-lg text-slate-500 italic">
            {lang === 'sw' ? t('dualExpertise') : "I work across engineering and language. That helps me see problems both logically and from a human perspective. And I do this work globally."}
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{lang === 'sw' ? 'MIAKA' : 'EXPERIENCE'}</div>
              <p className="text-base font-bold dark:text-white">{new Date().getFullYear() - 2017}+ {lang === 'sw' ? 'Miaka' : 'Years'}</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{t('alumniLabel')}</div>
              <p className="text-sm font-bold dark:text-white flex items-center gap-2"><GraduationCap size={16}/> JKUAT</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{t('baseLabel')}</div>
              <p className="text-sm font-bold dark:text-white flex items-center gap-2"><MapPin size={16}/> {portfolioData.profile.location}</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{t('roleLabel')}</div>
              <p className="text-sm font-bold dark:text-white truncate">{profileVariant.role}</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-[3rem] -rotate-3"></div>
          <div className="relative bg-white dark:bg-[#0d0e12] border border-slate-200 dark:border-white/5 p-12 rounded-[3rem] shadow-2xl space-y-12">
            <h4 className="font-display text-2xl font-bold text-indigo-600">{t('technicalPillar')}</h4>
            <div className="grid gap-8">
              <div className="flex gap-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 h-fit"><Zap size={24}/></div>
                <div>
                  <p className="font-bold mb-1">{t('highPerformance')}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{t('highPerformanceDesc')}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600 h-fit"><Database size={24}/></div>
                <div>
                  <p className="font-bold mb-1">{lang === 'sw' ? 'Mifumo ya Nyuma Thabiti' : 'Resilient Backend Systems'}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{lang === 'sw' ? 'Kutengeneza APIs salama na kujenga miundo ya data inayoeza katika PostgreSQL.' : 'Write solid APIs with Node.js. Build data structures in PostgreSQL that work at scale.'}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl text-blue-600 h-fit"><Globe size={24}/></div>
                <div>
                  <p className="font-bold mb-1">{lang === 'sw' ? 'Lokalisasi ya Kitamaduni' : 'Cultural Localization'}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{lang === 'sw' ? 'Tafsiri ya Kiswahili na UI/UX inayoboreswa kwa soko la kimataifa.' : 'Expert Swahili translation and UI/UX adaptation for international markets.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
