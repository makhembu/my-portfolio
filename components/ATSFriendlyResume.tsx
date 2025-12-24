'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/portfolioData';
import { Download, FileText } from 'lucide-react';
import { useTrack } from '@/hooks/useTrack';
import { useFilteredPortfolioData } from '@/lib/useFilteredPortfolioData';
import { ResumePDF } from './ResumePDF';
import { ResumePDFGenerator } from '@/lib/pdf/ResumePDFGenerator';

/**
 * ATSFriendlyResume - Beautiful, professionally designed resume
 * Now supports dual-track filtering (IT vs Translation)
 * Uses pure jsPDF generation (modular, following Jambo pattern)
 */
export const ATSFriendlyResume: React.FC = () => {
  const { activeTrack, setActiveTrack } = useTrack();
  const { experience, profileVariant, skills } = useFilteredPortfolioData();
  const { profile, socials, languages } = portfolioData;
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async () => {
    if (typeof window === 'undefined') return;
    
    setIsGenerating(true);
    try {
      const generator = new ResumePDFGenerator(portfolioData, activeTrack);
      const result = await generator.generate();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePlainText = (): string => {
    const skillsToDisplay = activeTrack === 'it' 
      ? skills as any
      : activeTrack === 'translation'
      ? skills as any
      : skills;

    let skillsSection = '';
    if (activeTrack === 'it') {
      const itSkills = skillsToDisplay;
      skillsSection = `SKILLS

Frontend Development
${itSkills.frontend?.join(', ') || ''}

Backend & Database
${itSkills.backend?.join(', ') || ''}

Infrastructure & DevOps
${itSkills.infrastructure?.join(', ') || ''}`;
    } else if (activeTrack === 'translation') {
      const translationSkills = skillsToDisplay;
      skillsSection = `SKILLS

Technical Specialization
${translationSkills.technical?.join(', ') || ''}

Languages
${translationSkills.languages?.join(', ') || ''}

Specializations
${translationSkills.specializations?.join(', ') || ''}`;
    } else {
      const itSkills = (skills as any).frontend ? skills : portfolioData.skills.it;
      skillsSection = `SKILLS

Frontend Development
${(itSkills as any).frontend?.join(', ') || ''}

Backend & Database
${(itSkills as any).backend?.join(', ') || ''}

Infrastructure & DevOps
${(itSkills as any).infrastructure?.join(', ') || ''}`;
    }

    return `${profile.firstName.toUpperCase()} ${profile.lastName.toUpperCase()}
${profileVariant.role.toUpperCase()}
Email: ${socials.email}
Location: ${profile.location}
GitHub: ${socials.github}
LinkedIn: ${socials.linkedin}

PROFESSIONAL SUMMARY
${profileVariant.summary}

${skillsSection}

PROFESSIONAL EXPERIENCE

${experience
  .map(
    (exp) => `${exp.role}
${exp.company} | ${exp.period}

${exp.description.map((d) => `• ${d}`).join('\n')}

Key Skills: ${exp.skills.join(', ')}`
  )
  .join('\n\n')}

EDUCATION
${profile.education}

LANGUAGES
${languages.map((l) => `${l.name}: ${l.level === 100 ? 'Native' : 'Professional'}`).join('\n')}

AVAILABILITY
${profile.availability}`;
  };

  const downloadText = () => {
    const text = generatePlainText();
    const trackSuffix = activeTrack === 'both' ? '' : `_${activeTrack}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.firstName}_${profile.lastName}_Resume${trackSuffix}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const text = generatePlainText();
    navigator.clipboard.writeText(text);
    alert('Resume copied to clipboard!');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
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
          💻 IT / Development
        </button>
        <button
          onClick={() => setActiveTrack('translation')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest transition-all ${
            activeTrack === 'translation'
              ? 'bg-green-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
          }`}
        >
          🌍 Translation / Linguistics
        </button>
        <button
          onClick={() => setActiveTrack('both')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest transition-all ${
            activeTrack === 'both'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
          }`}
        >
          ✨ Both Tracks
        </button>
      </div>

      {/* Download/Copy Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadPDF}
          disabled={isGenerating}
          className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
        <button
          onClick={downloadText}
          className="flex-1 bg-slate-600 text-white px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download Text
        </button>
        <button
          onClick={copyToClipboard}
          className="flex-1 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
        >
          Copy to Clipboard
        </button>
      </div>

      {/* Resume PDF Preview - Matches downloaded PDF exactly */}
      <div className="border-2 border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-white">
        <ResumePDF />
      </div>

      {/* Info Note */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 rounded-lg">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          <strong>✓ Track-Aware PDF:</strong> Select your preferred track above to download a tailored resume. IT track shows development work, Translation track shows linguistic work.
        </p>
      </div>
    </div>
  );
};
