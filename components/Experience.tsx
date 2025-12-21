
'use client';

import React from 'react';
import { portfolioData } from '@/portfolioData';
import { Calendar, Briefcase, CheckCircle2, Award } from 'lucide-react';
import { useLanguage, useResumeModal } from '@/lib/context';

export const Experience: React.FC = () => {
  const { t } = useLanguage();
  const { setIsResumeOpen } = useResumeModal();

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-20">
        <aside className="space-y-8 sticky top-32 h-fit">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Professional Track Record</h2>
            <h3 className="font-display text-4xl font-bold dark:text-white text-slate-900 tracking-tight">Experience & Signal.</h3>
            <p className="text-slate-500 text-lg font-light leading-relaxed italic border-l-2 border-indigo-600/30 pl-4">
              "7+ years shipping production software. From infrastructure at scale to SaaS platforms. Always focused on impact."
            </p>
          </div>
          
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6">
            <div className="flex items-center gap-3 text-indigo-600">
              <Award size={20} />
              <span className="font-black text-[10px] uppercase tracking-widest">Strengths</span>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Full-stack TypeScript/Next.js architecture.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Production databases (PostgreSQL/Supabase).</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Infrastructure & Linux administration.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400">Localization expertise (Swahili/English).</span>
              </li>
            </ul>
          </div>
        </aside>

        <div className="space-y-12 relative before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-slate-200 dark:before:bg-white/5 pl-8 md:pl-12">
          {portfolioData.experience.map((exp) => (
            <div key={exp.id} className="relative group">
              <div className="absolute -left-[33px] md:-left-[49px] top-1 w-4 h-4 rounded-full bg-white dark:bg-[#0a0a0b] border-2 border-indigo-600 group-hover:scale-125 transition-transform z-10"></div>
              
              <div className="space-y-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold dark:text-white text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.role}</h4>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                      <Briefcase size={14} />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Calendar size={12} />
                    {exp.period}
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest opacity-60">Personal Impact</p>
                   <ul className="space-y-3">
                    {exp.description.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/40 shrink-0"></div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex flex-wrap gap-2">
                  {exp.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 p-12 bg-indigo-600 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-indigo-600/20">
        <h4 className="text-3xl font-display font-bold text-white">Remove the Doubt.</h4>
        <p className="text-indigo-100 text-lg font-light">Available for engineering roles where technical judgment and cultural nuance matter.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
           <a href={`mailto:${portfolioData.socials.email}`} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
            Direct Contact
          </a>
          <button 
            onClick={() => setIsResumeOpen(true)}
            className="bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-800 transition-all border border-indigo-500/30"
          >
            Download Tech Specs
          </button>
        </div>
      </div>
    </div>
  );
};
