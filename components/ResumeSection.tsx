'use client';

import React from 'react';
import { FileText, Zap } from 'lucide-react';
import { ATSFriendlyResume } from './ATSFriendlyResume';
import { ResumeOptimizer } from './ResumeOptimizer';
import { useResumeUnlock } from '@/lib/resumeContext';
import { useLanguage } from '@/lib/context';
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
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Resume Intelligence</h2>
        <h3 className="font-display text-5xl font-bold dark:text-white text-slate-900">ATS-Optimized & AI-Powered.</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-light">
          Professional resume optimized for both ATS systems and recruiters. Plus AI job matching to tailor your resume for specific opportunities.
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
              ✓ Recruiter & ATS Ready
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Clean, semantic text-based resume that works with every ATS system and human recruiter. Download as PDF or copy as text.
            </p>
          </div>
          <ATSFriendlyResume />
        </div>
      )}

      {activeTab === 'optimizer' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-500/20 rounded-2xl">
            <h4 className="font-bold text-lg text-purple-900 dark:text-purple-300 mb-2">
              🤖 AI-Powered Optimization
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Paste any job description. Our AI analyzes it and tailors your resume to match perfectly reordering experience by relevance, highlighting matching skills, and optimizing bullet points. See your match score instantly.
            </p>
          </div>
          <ResumeOptimizer />
        </div>
      )}
    </div>
  );
};
