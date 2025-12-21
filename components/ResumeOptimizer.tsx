'use client';

import React, { useState } from 'react';
import { Loader2, Send, Copy, Download, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { optimizeResumeForJob, calculateMatchScore, extractJobKeywords } from '@/services/resumeOptimizationService';
import { portfolioData } from '@/portfolioData';
import { useTrack } from '@/lib/useTrackContext';
import { ResumeOptimizerModal } from './ResumeOptimizerModal';
import { CareerTrack } from '@/types';

interface OptimizedResume {
  summary: string;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string[];
    skills: string[];
    relevanceScore: number;
  }>;
  skills: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  relevantProjects: string[];
  keywordMatches: string[];
  matchScore: number;
  track: CareerTrack;
}

export const ResumeOptimizer: React.FC = () => {
  const { activeTrack, setActiveTrack } = useTrack();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [optimized, setOptimized] = useState<OptimizedResume | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('Job Position');

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await optimizeResumeForJob(jobDescription, activeTrack);
      setOptimized(result);
      // Extract job title from the job description (first line or first sentence)
      const title = jobDescription.split('\n')[0].split('.')[0].slice(0, 50) || 'Job Position';
      setJobTitle(title);
      // Open modal automatically when optimization completes
      setShowModal(true);
    } catch (err) {
      setError('Failed to optimize resume. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!optimized) return;

    const text = `${portfolioData.profile.firstName} ${portfolioData.profile.lastName}

${optimized.summary}

SKILLS
${Object.entries(optimized.skills)
  .map(([category, skills]) => `${category}: ${skills.join(', ')}`)
  .join('\n')}

EXPERIENCE
${optimized.experience
  .map(
    (exp) => `${exp.role} | ${exp.company} | ${exp.period}
${exp.description.map((d) => `• ${d}`).join('\n')}`
  )
  .join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    if (!optimized) return;

    const text = `${portfolioData.profile.firstName} ${portfolioData.profile.lastName}
${portfolioData.socials.email} | ${portfolioData.profile.location}

${optimized.summary}

KEYWORDS: ${optimized.keywordMatches.join(', ')}
MATCH SCORE: ${optimized.matchScore}%

SKILLS
${Object.entries(optimized.skills)
  .map(([category, skills]) => `${category}: ${skills.join(', ')}`)
  .join('\n')}

EXPERIENCE
${optimized.experience
  .map(
    (exp) => `${exp.role} | ${exp.company} | ${exp.period} (Relevance: ${exp.relevanceScore}%)
${exp.description.map((d) => `• ${d}`).join('\n')}
Skills: ${exp.skills.join(', ')}`
  )
  .join('\n\n')}

RELEVANT PROJECTS
${optimized.relevantProjects.join('\n')}`;

    const trackSuffix = activeTrack === 'both' ? '' : `_${activeTrack}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioData.profile.firstName}_${portfolioData.profile.lastName}_Optimized_Resume${trackSuffix}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Track Selection */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setActiveTrack('it')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest transition-all ${
            activeTrack === 'it'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
          }`}
        >
          💻 IT / Development Job
        </button>
        <button
          onClick={() => setActiveTrack('translation')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest transition-all ${
            activeTrack === 'translation'
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
          }`}
        >
          🌍 Translation Job
        </button>
        <button
          onClick={() => setActiveTrack('both')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest transition-all ${
            activeTrack === 'both'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
          }`}
        >
          ✨ All Background
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-bold dark:text-white">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here. The AI will tailor your resume to match it perfectly..."
            className="w-full h-48 p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 rounded-xl">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <button
          onClick={handleOptimize}
          disabled={isLoading || !jobDescription.trim()}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Send size={18} />
              Optimize Resume
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {optimized && (
        <div className="space-y-6 bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-950/20 dark:to-slate-900/20 p-8 rounded-3xl border border-indigo-200 dark:border-indigo-500/20">
          {/* Match Score */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">
                Match Score
              </p>
              <div className="flex items-end gap-4">
                <div className="text-5xl font-bold text-indigo-600">
                  {optimized.matchScore}%
                </div>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all"
                    style={{ width: `${optimized.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">
                Keyword Matches
              </p>
              <div className="flex flex-wrap gap-2">
                {optimized.keywordMatches.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-lg uppercase tracking-widest flex items-center gap-1"
                  >
                    <CheckCircle2 size={12} />
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Optimized Summary */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Optimized Professional Summary
            </p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {optimized.summary}
            </p>
          </div>

          {/* Experience by Relevance */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Experience (Ranked by Relevance)
            </p>
            <div className="space-y-4">
              {optimized.experience.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-lg dark:text-white text-slate-900">
                        {exp.role}
                      </h4>
                      <p className="text-sm text-indigo-600 font-bold">
                        {exp.company} • {exp.period}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-500">
                        Relevance
                      </p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {exp.relevanceScore}%
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {exp.description.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Relevant Skills
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(optimized.skills).map(([category, skills]) => (
                <div key={category}>
                  <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-slate-50 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <FileText size={16} />
              View PDF Preview
            </button>
            <button
              onClick={downloadAsText}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download Text
            </button>
          </div>
        </div>
      )}

      {/* Resume Optimizer Modal */}
      <ResumeOptimizerModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        optimized={optimized}
        jobTitle={jobTitle}
      />
    </div>
  );
};
