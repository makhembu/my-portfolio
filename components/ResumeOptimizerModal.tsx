'use client';

import React, { useRef, useState } from 'react';
import { X, Download, AlertCircle, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { ResumePDF } from './ResumePDF';
import { portfolioData } from '@/portfolioData';

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
}

interface ResumeOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  optimized: OptimizedResume | null;
  jobTitle?: string;
}

export const ResumeOptimizerModal: React.FC<ResumeOptimizerModalProps> = ({
  isOpen,
  onClose,
  optimized,
  jobTitle = 'Job Position'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoom, setZoom] = useState(1.35);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      if (!optimized) {
        throw new Error('No optimized resume data available');
      }

      // Dynamic import to avoid SSR issues
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF;

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false,
      });

      const PDFHeaderModule = await import('@/lib/pdf/PDFHeader');
      const PDFSectionModule = await import('@/lib/pdf/PDFSection');
      const PDFFooterModule = await import('@/lib/pdf/PDFFooter');
      const PDFConfigModule = await import('@/lib/pdf/PDFConfig');

      const ResumePDFHeader = PDFHeaderModule.ResumePDFHeader;
      const ResumePDFSection = PDFSectionModule.ResumePDFSection;
      const ResumePDFFooter = PDFFooterModule.ResumePDFFooter;
      const CONSTANTS = PDFConfigModule.CONSTANTS;
      const COLORS = PDFConfigModule.COLORS;

      // 1. HEADER
      const header = new ResumePDFHeader(doc);
      const contactInfo = [
        { label: 'Email', value: portfolioData.socials.email },
        { label: 'Location', value: portfolioData.profile.location },
        { label: 'GitHub', value: portfolioData.socials.github?.split('https://')[1] },
        { label: 'LinkedIn', value: portfolioData.socials.linkedin?.split('https://')[1] },
      ].filter((item) => item.value);

      let currentY = header.render(
        portfolioData.profile.firstName,
        portfolioData.profile.lastName,
        portfolioData.profile.variants.it.role,
        contactInfo
      );

      // 2. PROFESSIONAL SUMMARY
      const section = new ResumePDFSection(doc);
      currentY = section.renderSection('PROFESSIONAL SUMMARY', currentY);
      currentY = section.renderSummary(optimized.summary, currentY);

      // 3. PROFESSIONAL EXPERIENCE (Using optimized, reordered experience)
      currentY = section.renderSection('PROFESSIONAL EXPERIENCE', currentY);
      for (const exp of optimized.experience) {
        currentY = section.renderExperienceItem(
          exp.role,
          exp.company,
          exp.period,
          exp.description,
          currentY
        );
      }

      // 4. EDUCATION
      currentY = section.renderSection('EDUCATION', currentY);
      currentY = section.renderEducationItem(
        portfolioData.profile.education,
        'Jomo Kenyatta University of Agriculture and Technology (JKUAT)',
        '2014-2018',
        currentY
      );

      // 5. TECHNICAL SKILLS (Using optimized skills)
      currentY = section.renderSkillsSection(optimized.skills, currentY);

      // 6. LANGUAGES
      if (portfolioData.languages && portfolioData.languages.length > 0) {
        currentY = section.renderSection('LANGUAGES', currentY);
        const langText = portfolioData.languages.map((lang) => lang.name).join(', ');
        doc.setFontSize(8);
        doc.setTextColor(COLORS.secondary);
        doc.text(langText, CONSTANTS.MARGIN, currentY);
        currentY += CONSTANTS.SECTION_SPACING + 2;
      }

      // 7. FOOTER (Page numbers)
      const footer = new ResumePDFFooter(doc);
      footer.addPageFooters();

      // Save the PDF with job title in filename
      const sanitizedJobTitle = jobTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${portfolioData.profile.firstName}_${portfolioData.profile.lastName}_Optimized_${sanitizedJobTitle}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`${isFullscreen ? 'fixed inset-4 rounded-2xl flex flex-col' : 'rounded-3xl max-w-5xl my-8'} bg-white dark:bg-slate-900 shadow-2xl w-full`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Optimized Resume Preview
            </h2>
            {jobTitle !== 'Job Position' && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tailored for: <span className="font-bold text-indigo-600">{jobTitle}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Match Score Banner */}
        {optimized && (
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-6 border-b border-indigo-200 dark:border-indigo-500/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">
                  Alignment Score
                </p>
                <div className="flex items-end gap-4">
                  <div className="text-4xl font-bold text-indigo-600">
                    {optimized.matchScore}%
                  </div>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden max-w-xs">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                      style={{ width: `${optimized.matchScore}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                  Key Matched Keywords
                </p>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {optimized.keywordMatches.slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold rounded uppercase tracking-widest"
                    >
                      {keyword}
                    </span>
                  ))}
                  {optimized.keywordMatches.length > 4 && (
                    <span className="px-2.5 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[9px] font-bold rounded">
                      +{optimized.keywordMatches.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CV Best Practices Notice */}
        <div className="flex items-start gap-3 p-4 mx-6 mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/20 rounded-lg">
          <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <span className="font-bold">This resume has been optimized to match the job requirements</span> while maintaining all professional CV standards: strong action verbs, quantifiable metrics, single-page format, and ATS-friendly structure.
          </p>
        </div>

        {/* Resume Preview */}
        <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : 'p-6 max-h-[60vh]'}`}>
          {/* Zoom Controls */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={18} className="text-slate-600 dark:text-slate-400" />
              </button>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={18} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              <Maximize2 size={18} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Resume Container */}
          <div className={`${isFullscreen ? 'overflow-y-auto flex-1' : 'overflow-y-auto'}`}>
            <div
              className="bg-white rounded-lg shadow-sm"
              style={{
                width: '210mm',
                minHeight: '297mm',
                margin: '0 auto',
                padding: '0',
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                marginBottom: zoom > 1 ? '100px' : '0'
              }}
            >
            <ResumePDF 
              profile={{
                firstName: 'Brian',
                lastName: 'Makhembu',
                role: 'Full-Stack Developer | AI/ML & Automation',
                bio: optimized?.summary || 'Professional summary optimized for the job position.',
                location: 'Remote',
                email: 'makhembu.brian@gmail.com',
                education: 'B.S. Computer Technology, JKUAT (2014-2018)',
                availability: 'Available for Remote & Global Opportunities'
              }}
              experience={optimized?.experience.map(exp => ({
                id: exp.id,
                company: exp.company,
                role: exp.role,
                period: exp.period,
                description: exp.description,
                skills: exp.skills
              })) || []}
              skills={optimized?.skills || { frontend: [], backend: [], infrastructure: [] }}
              languages={[
                { name: 'English', level: 100 },
                { name: 'Swahili', level: 100 }
              ]}
            />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-4 p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 ${isFullscreen ? 'fixed bottom-0 left-0 right-0 z-50' : ''}`}>
          <button
            onClick={onClose}
            className="flex-1 bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 py-3 px-6 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-slate-100 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-white/10"
          >
            Close Preview
          </button>
          <button
            onClick={downloadPDF}
            disabled={isGenerating}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isGenerating ? 'Generating...' : 'Download Optimized PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};
