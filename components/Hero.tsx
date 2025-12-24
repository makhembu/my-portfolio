
'use client';

import React from 'react';
import { ArrowRight, Code2, Globe, Command, Terminal } from 'lucide-react';
import { portfolioData } from '@/portfolioData';
import { useLanguage, useResumeModal } from '@/hooks/useAppContext';

export const Hero: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setIsResumeOpen } = useResumeModal();

  return (
    <section className="w-full min-h-[calc(100vh-100px)] flex flex-col justify-center py-8 md:py-12 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-500/20">
                <Command size={14} />
                {t('availabilityLabel')}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/10">
                <Terminal size={14} />
                React • TypeScript • Node.js
              </div>
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.95] lg:leading-[0.9]">
              {t('heroTitle1')} <span className="text-indigo-600">{t('heroTitle2')}</span>.<br/>
              {t('heroTitle3')} <span className="text-slate-400 italic font-light">{t('heroTitle4')}</span>.
            </h1>

            <div className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-light leading-relaxed">
              {lang === 'sw' ? t('tagline') : portfolioData.profile.variants.it.summary}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href={`mailto:${portfolioData.socials.email}?subject=Engineering Opportunity&body=Hi Brian,`}
                className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
              >
                {t('ctaContact')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href={portfolioData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 transition-all text-center flex items-center justify-center gap-3 group"
              >
                {lang === 'sw' ? t('viewGitHub') : 'View GitHub'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => setIsResumeOpen(true)}
                className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 transition-all text-center"
              >
                {t('resumeBtn')}
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-200">
             <div className="absolute -inset-20 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
             <div className="relative space-y-6">
                <div className="bg-white dark:bg-[#0d0e12] border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] shadow-3xl translate-x-6 hover:translate-x-0 transition-transform duration-700 group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform"><Code2 size={20}/></div>
                    <div className="font-display font-bold text-base">{lang === 'sw' ? t('signalDelivery') : 'Signal: Global Delivery'}</div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic">"{lang === 'sw' ? t('deliveryDesc') : '6+ years shipping software that works. React, TypeScript, Node.js. For teams globally.'}"</p>
                </div>
                <div className="bg-white dark:bg-[#0d0e12] border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] shadow-3xl -translate-x-6 hover:translate-x-0 transition-transform duration-700 group">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform"><Globe size={20}/></div>
                    <div className="font-display font-bold text-base">{lang === 'sw' ? t('signalLocalization') : 'Signal: Localization'}</div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic">"{lang === 'sw' ? t('localizationDesc') : 'I translate for global products. English to Swahili. 50+ projects, 70%+ accuracy. I understand both the tech and the language.'}"</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
