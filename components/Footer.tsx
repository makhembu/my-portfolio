
'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/portfolioData';
import { Github, Linkedin, Mail, Lock } from 'lucide-react';
import { PINModal } from './PINModal';
import { useResumeUnlock } from '@/lib/resumeContext';
import { useLanguage } from '@/lib/context';

const RECRUITER_PIN = '123456';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isPINModalOpen, setIsPINModalOpen] = useState(false);
  const { setIsResumeUnlocked } = useResumeUnlock();
  const { t } = useLanguage();

  const handleUnlockResume = () => {
    setIsPINModalOpen(true);
  };

  const handlePINSuccess = () => {
    setIsResumeUnlocked(true);
    setIsPINModalOpen(false);
  };

  return (
    <>
      <footer className="border-t border-slate-200 dark:border-white/5 py-12 md:py-20 bg-slate-50 dark:bg-transparent overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid md:grid-cols-2 gap-8 md:gap-20 items-center">
          <div className="space-y-6 md:space-y-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold dark:text-white text-slate-900 tracking-tighter">{t('footerContact')}</h2>
            <div className="flex gap-4 md:gap-6 flex-wrap">
              <a href={portfolioData.socials.github} target="_blank" rel="noopener noreferrer" className="p-3 md:p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><Github size={24}/></a>
              <a href={portfolioData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 md:p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><Linkedin size={24}/></a>
              <a href={`mailto:${portfolioData.socials.email}`} className="p-3 md:p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:text-indigo-600 transition-all shadow-sm"><Mail size={24}/></a>
              <button 
                onClick={handleUnlockResume}
                className="p-3 md:p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:text-indigo-600 transition-all shadow-sm" 
                title="Unlock Premium Resume Tools"
              >
                <Lock size={24}/>
              </button>
            </div>
          </div>
          <div className="p-8 md:p-12 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-[3rem] space-y-8 shadow-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">{t('baseLabel')}</p>
                <p className="font-bold text-sm md:text-base dark:text-white">{portfolioData.profile.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">{t('footerEmail')}</p>
                <p className="sm:hidden font-bold text-sm dark:text-white truncate" title={portfolioData.socials.email}>{portfolioData.socials.email}</p>
                <p className="hidden sm:block font-bold text-sm md:text-base dark:text-white" title={portfolioData.socials.email}>{portfolioData.socials.email}</p>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center text-[9px] md:text-[10px] font-black text-slate-400 tracking-[0.2em] md:tracking-[0.3em] uppercase gap-4 text-center sm:text-left">
              <span>© {currentYear} Brian Makhembu</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PIN Modal */}
      <PINModal 
        isOpen={isPINModalOpen}
        onClose={() => setIsPINModalOpen(false)}
        onSuccess={handlePINSuccess}
        correctPin={RECRUITER_PIN}
      />
    </>
  );
};
