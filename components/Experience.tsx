
'use client';

import React from 'react';
import { portfolioData } from '@/portfolioData';
import { Calendar, Briefcase, CheckCircle2, Award } from 'lucide-react';
import { useLanguage, useResumeModal } from '@/lib/context';

export const Experience: React.FC = () => {
  const { lang, t } = useLanguage();
  const { setIsResumeOpen } = useResumeModal();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20">
      <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 md:gap-12 lg:gap-20">
        <aside className="space-y-6 md:sticky md:top-32 md:h-fit">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-indigo-600">{t('professionalTrack')}</h2>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold dark:text-white text-slate-900 tracking-tight">{t('professionalTrackTitle')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed italic border-l-2 border-indigo-600/30 pl-3 sm:pl-4">
              "{lang === 'sw' ? 'Miaka 7+ inayobeba programu ya uzalishaji. Kutoka miundombinu kwa kiwango kikubwa hadi mifumo ya SaaS. Daima iliyozingatia matokeo.' : '7+ years shipping production software. From infrastructure at scale to SaaS platforms. Always focused on impact.'}"
            </p>
          </div>
          
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-white/5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 text-indigo-600">
              <Award size={16} className="sm:w-5 sm:h-5" />
              <span className="font-black text-[8px] sm:text-[10px] uppercase tracking-widest">{t('strengths')}</span>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{t('fullstackArch')}</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{t('productionDB')}</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{t('infrastructure')}</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">{t('localization')}</span>
              </li>
            </ul>
          </div>
        </aside>

        <div className="space-y-6 sm:space-y-8 md:space-y-12 relative before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-slate-200 dark:before:bg-white/5 pl-5 sm:pl-8 md:pl-12">
          {portfolioData.experience.map((exp) => (
            <div key={exp.id} className="relative group">
              <div className="absolute -left-[18px] sm:-left-[33px] md:-left-[49px] top-1 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-white dark:bg-[#0a0a0b] border-2 border-indigo-600 group-hover:scale-125 transition-transform z-10"></div>
              
              <div className="space-y-4 sm:space-y-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-2xl md:rounded-[2rem] hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-lg md:text-xl font-bold dark:text-white text-slate-900 group-hover:text-indigo-600 transition-colors break-words">{exp.role}</h4>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs sm:text-sm mt-1">
                      <Briefcase size={12} className="sm:w-4 sm:h-4 shrink-0" />
                      <span className="truncate">{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 shrink-0">
                    <Calendar size={10} className="sm:w-3 sm:h-3" />
                    {exp.period}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                   <p className="text-[8px] sm:text-[10px] font-black uppercase text-indigo-500 tracking-widest opacity-60">{t('personalImpact')}</p>
                   <ul className="space-y-2 sm:space-y-3">
                    {exp.description.map((point, i) => (
                      <li key={i} className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        <div className="mt-1.5 sm:mt-2 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-indigo-500/40 shrink-0"></div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 sm:pt-4 flex flex-wrap gap-1.5 sm:gap-2">
                  {exp.skills.map(skill => (
                    <span key={skill} className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded text-[7px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 md:mt-20 p-6 sm:p-8 md:p-12 bg-indigo-600 rounded-2xl sm:rounded-3xl md:rounded-[3rem] text-center space-y-4 sm:space-y-6 shadow-2xl shadow-indigo-600/20">
        <h4 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">{t('removeDoubt')}</h4>
        <p className="text-sm sm:text-base md:text-lg text-indigo-100 font-light">{t('removeDoubtDesc')}</p>
        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
           <a href={`mailto:${portfolioData.socials.email}`} className="bg-white text-indigo-600 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
            {t('directContact')}
          </a>
          <button 
            onClick={() => setIsResumeOpen(true)}
            className="bg-indigo-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:bg-indigo-800 transition-all border border-indigo-500/30"
          >
            {t('downloadTechSpecs')}
          </button>
        </div>
      </div>
    </div>
  );
};
