'use client';

import React from 'react';
import { FileText, Zap } from 'lucide-react';
import { ATSFriendlyResume } from './ATSFriendlyResume';
import { ResumeOptimizer } from './ResumeOptimizer';
import { useResumeUnlock } from '@/hooks/useResumeUnlock';
import { useLanguage } from '@/hooks/useAppContext';
import { useState } from 'react';

export const ResumeSection: React.FC = () => {
  const { isResumeUnlocked } = useResumeUnlock();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ats' | 'optimizer'>('ats');

  // Don't render the section at all if not unlocked
  if (!isResumeUnlocked) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 space-y-8 md:space-y-12 overflow-hidden">
      {/* Header with New Framing */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Resume Tools</h2>
        <h3 className="font-display text-5xl font-bold dark:text-white text-slate-900">Two Approaches. Same Source.</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-light">
          One resume. Multiple formats. Get a PDF that works with ATS systems. Download as plain text. Or use a tool to match it against specific job descriptions.
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-6 space-y-3">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <strong>Why this matters:</strong> Your resume data isn't locked into a PDF or buried in some tool. It's structured. You control it. You can render it as PDF, as text, or feed it into the job matcher below. The job matcher is useful, not magic. It reorders your experience by relevance to a specific role.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab('ats')}
          className={`flex items-center gap-2 px-6 py-4 font-bold uppercase text-[10px] tracking-widest transition-all border-b-2 ${
            activeTab === 'ats'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText size={16} />
          Download Resume
        </button>
        <button
          onClick={() => setActiveTab('optimizer')}
          className={`flex items-center gap-2 px-6 py-4 font-bold uppercase text-[10px] tracking-widest transition-all border-b-2 ${
            activeTab === 'optimizer'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap size={16} />
          AI Job Matcher
        </button>
      </div>

      {/* Content */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-500/20 rounded-2xl">
            <h4 className="font-bold text-lg text-blue-900 dark:text-blue-300 mb-2">
              Download Your Resume
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              A resume that actually works. Recruiters can read it. ATS systems can parse it. Download as PDF or copy the text.
            </p>
          </div>
          <ATSFriendlyResume />
        </div>
      )}

      {activeTab === 'optimizer' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-500/20 rounded-2xl">
            <h4 className="font-bold text-lg text-purple-900 dark:text-purple-300 mb-2">
              See How You Fit
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Paste a job description. I'll reorder your experience by relevance, highlight what matches, and show you your fit score. It's not magic. It's useful.
            </p>
          </div>
          <ResumeOptimizer />
        </div>
      )}
    </div>
  );
};
