'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X, FileText, Download, Languages } from 'lucide-react';
import { ResumePDF } from './ResumePDF';
import { portfolioData } from '@/portfolioData';
import { useLanguage, useTheme, useResumeModal } from '@/lib/context';
import { safeDocument } from '@/lib/browserUtils';

/**
 * Navbar - Fixed navigation bar for the portfolio
 * Handles theme toggle, language switch, and navigation
 */
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const { isResumeOpen, setIsResumeOpen } = useResumeModal();

  const links = [
    { id: 'home', label: t('navHome'), href: '#home' },
    { id: 'work', label: t('navWork'), href: '#projects' },
    { id: 'experience', label: t('navExp'), href: '#experience' },
    { id: 'about', label: t('navAbout'), href: '#about' },
    { id: 'ai', label: t('navAI'), href: '#ai' },
  ];

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const originalTitle = safeDocument.getTitle();
    safeDocument.setTitle(`${portfolioData.profile.firstName}_${portfolioData.profile.lastName}_Resume`);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
      safeDocument.setTitle(originalTitle);
    }, 100);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass bg-white/80 dark:bg-[#0a0a0b]/80 border-b border-slate-200 dark:border-white/5 py-4 transition-all print:hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={handleNavClick}
          >
            <div className="bg-indigo-600 text-white w-9 h-9 flex items-center justify-center rounded-lg font-display font-bold shadow-lg shadow-indigo-600/20 group-hover:rotate-6 transition-transform">BM</div>
            <div className="flex flex-col">
              <span className="font-display font-bold dark:text-white text-slate-900 text-sm tracking-tight">BRIAN M.</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-indigo-500 font-black">Full-Stack Specialist</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {links.map(link => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="text-[10px] uppercase tracking-[0.2em] font-black transition-all hover:translate-y-[-1px] text-slate-500 hover:text-indigo-600 hover:dark:text-indigo-400 dark:hover:text-indigo-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10"></div>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >EN</button>
              <button 
                onClick={() => setLang('sw')}
                className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${lang === 'sw' ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >SW</button>
            </div>

            {/* Resume Button */}
            <button 
              onClick={() => setIsResumeOpen(true)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-200 dark:border-indigo-500/20 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <FileText size={14} /> {t('resumeBtn')}
            </button>

            {/* Theme Toggle - Professional Switch */}
            <button 
              onClick={toggleTheme}
              className="relative w-12 h-6 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors flex items-center px-0.5"
              aria-label="Toggle Theme"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {/* Toggle circle */}
              <div className={`w-5 h-5 bg-white dark:bg-slate-900 rounded-full shadow-md transition-transform flex items-center justify-center ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                {darkMode ? (
                  <Moon size={12} className="text-indigo-500" />
                ) : (
                  <Sun size={12} className="text-amber-500" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
            >
              <Languages size={18} />
            </button>
            <button 
              className="text-slate-600 dark:text-slate-400"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Resume Modal */}
      {isResumeOpen && (
        <div className="resume-print-wrapper fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 print:static print:block print:p-0">
          <div 
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm print:hidden" 
            onClick={() => setIsResumeOpen(false)}
          ></div>
          <div className="relative w-full max-w-5xl h-full flex flex-col bg-slate-100 dark:bg-[#16181d] rounded-[2.5rem] overflow-hidden shadow-3xl animate-in zoom-in duration-300 print:block print:shadow-none print:bg-white print:rounded-none">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0e12] print:hidden">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white"><FileText size={20}/></div>
                <div>
                  <h4 className="font-display font-bold text-sm">Resume Tools</h4>
                  <p className="text-[10px] uppercase font-black tracking-widest text-indigo-500">ATS-Optimized & AI-Powered</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button 
                  onClick={() => setIsResumeOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-200 dark:bg-slate-800 p-8 print:p-0 print:bg-white print:overflow-visible print:block">
              <ResumePDF />
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > *:not(.resume-print-wrapper) { display: none !important; }
          #__next > *:not(.resume-print-wrapper) { display: none !important; }
          .resume-print-wrapper {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: white !important;
            z-index: 1 !important;
          }
          #resume-document { margin: 0 auto !important; padding: 0.5in !important; width: 100% !important; box-shadow: none !important; }
          @page { size: auto; margin: 0; }
        }
      ` }} />
    </>
  );
};
