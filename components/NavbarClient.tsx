'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, Menu, X, FileText, Download, Languages, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { US, GB, KE } from 'country-flag-icons/react/3x2';
import { ResumePDF } from './ResumePDF';
import { portfolioData } from '@/portfolioData';
import { useLanguage, useTheme, useResumeModal } from '@/hooks/useAppContext';
import { safeDocument } from '@/lib/browserUtils';
import { generateAndDownloadResumePDF } from '@/lib/resumePDFGenerator';

/**
 * Navbar - Fixed navigation bar for the portfolio
 * Handles theme toggle, language switch, and navigation
 */
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userCountry, setUserCountry] = useState<'US' | 'GB'>('GB');
  const [resumeZoom, setResumeZoom] = useState(1);
  const [isResumeFullscreen, setIsResumeFullscreen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const { isResumeOpen, setIsResumeOpen } = useResumeModal();

  // Handle Escape key to exit fullscreen
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResumeFullscreen) {
        setIsResumeFullscreen(false);
      }
      if (e.key === 'Escape' && isResumeOpen && !isResumeFullscreen) {
        setIsResumeOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isResumeFullscreen, isResumeOpen]);

  const links = [
    { id: 'home', label: t('navHome'), href: '#home' },
    { id: 'about', label: t('navAbout'), href: '#about' },
    { id: 'work', label: t('navWork'), href: '#projects' },
    { id: 'experience', label: t('navExp'), href: '#experience' },
  ];

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await generateAndDownloadResumePDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass bg-white/80 dark:bg-[#0a0a0b]/80 border-b border-slate-200 dark:border-white/5 py-4 transition-all print:hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex justify-between items-center">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${lang === 'en' ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                {userCountry === 'US' ? <US width={16} height={12} /> : <GB width={16} height={12} />} EN
              </button>
              <button 
                onClick={() => setLang('sw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${lang === 'sw' ? 'bg-white dark:bg-white/10 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >
                <KE width={16} height={12} /> SW
              </button>
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider"
              title={lang === 'en' ? 'Switch to Swahili' : 'Switch to English'}
            >
              {lang === 'en' ? (
                <>
                  <GB width={14} height={10} />
                  EN
                </>
              ) : (
                <>
                  <KE width={14} height={10} />
                  SW
                </>
              )}
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
        <div className={`${isResumeFullscreen ? 'fixed inset-0 z-[100]' : 'fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10'} print:static print:block print:p-0`}>
          {!isResumeFullscreen && (
            <div 
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm print:hidden cursor-pointer" 
              onClick={() => setIsResumeOpen(false)}
            ></div>
          )}
          
          <div className={`relative ${isResumeFullscreen ? 'inset-0 rounded-none' : 'w-full max-w-5xl h-full rounded-[2.5rem]'} flex flex-col bg-slate-100 dark:bg-[#16181d] overflow-hidden shadow-3xl animate-in zoom-in duration-300 print:block print:shadow-none print:bg-white print:rounded-none`}>
            {/* Fixed Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0e12] print:hidden ${isResumeFullscreen ? 'sticky top-0 z-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><FileText size={18}/></div>
                <div>
                  <h4 className="font-display font-bold text-xs">Resume</h4>
                  <p className="text-[9px] uppercase font-black tracking-widest text-indigo-500">Preview</p>
                </div>
              </div>

              {/* Controls - Always Visible */}
              <div className={`flex items-center gap-2 ${isResumeFullscreen ? 'flex-wrap justify-center' : ''}`}>
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1">
                  <button 
                    onClick={() => setResumeZoom(Math.max(0.5, resumeZoom - 0.1))}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors"
                    title="Zoom out (-)  [Keyboard]"
                  >
                    <ZoomOut size={14} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 min-w-10 text-center">
                    {Math.round(resumeZoom * 100)}%
                  </span>
                  <button 
                    onClick={() => setResumeZoom(Math.min(2, resumeZoom + 0.1))}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors"
                    title="Zoom in (+)  [Keyboard]"
                  >
                    <ZoomIn size={14} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                <button 
                  onClick={() => setIsResumeFullscreen(!isResumeFullscreen)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                  title={isResumeFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
                >
                  <Maximize2 size={14} className="text-slate-600 dark:text-slate-400" />
                </button>

                {/* Download Button */}
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                >
                  <Download size={12} /> PDF
                </button>

                {/* Close Button - Always Visible */}
                <button 
                  onClick={() => isResumeFullscreen ? setIsResumeFullscreen(false) : setIsResumeOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                  title={isResumeFullscreen ? 'Exit fullscreen (Esc)' : 'Close (Esc)'}
                >
                  <X size={16} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Scrollable Content with Transform */}
            <div 
              className={`${isResumeFullscreen ? 'flex-1 overflow-y-auto' : 'flex-1 overflow-y-auto'} bg-slate-200 dark:bg-slate-800 p-6 print:p-0 print:bg-white print:overflow-visible print:block`}
              style={{ 
                transformOrigin: 'top center',
              }}
            >
              <div style={{ transform: `scale(${resumeZoom})`, transformOrigin: 'top center' }}>
                <ResumePDF />
              </div>
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
