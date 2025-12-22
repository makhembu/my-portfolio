/**
 * lib/pdf/ResumePDFGenerator.ts
 * Main PDF generation class following Jambo's architecture
 * Now supports track-specific resume generation (IT vs Translation)
 */

import { ResumePDFHeader } from './PDFHeader';
import { ResumePDFSection } from './PDFSection';
import { ResumePDFFooter } from './PDFFooter';
import { CONSTANTS, COLORS } from './PDFConfig';
import { EnhancedPortfolioData } from '@/portfolioData';
import { CareerTrack } from '@/types';

export interface PDFGenerationResult {
  success: boolean;
  error?: string;
}

export class ResumePDFGenerator {
  private doc: any;
  private data: EnhancedPortfolioData;
  private track: CareerTrack;

  constructor(data: EnhancedPortfolioData, track: CareerTrack = 'both') {
    this.data = data;
    this.track = track;
  }

  /**
   * Filter experience based on track and recency (hide jobs started >5 years ago, except ongoing roles)
   * Also hides explicitly outdated roles that are no longer relevant to current job search
   */
  private getFilteredExperience() {
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());

    // IDs of jobs to hide from PDF downloads (still visible on site)
    const hideInPdfIds = new Set(['exp-3', 'exp-4']); // IT Technician & Infrastructure Lead, Android Developer

    let filtered = this.data.experience;
    
    // Filter by track
    if (this.track !== 'both') {
      filtered = filtered.filter(exp => exp.track === this.track || exp.track === 'both');
    }

    // Hide explicitly outdated roles from PDF
    filtered = filtered.filter(exp => !hideInPdfIds.has(exp.id));

    // Filter by recency: keep jobs that started within last 5 years OR are still ongoing (Present)
    filtered = filtered.filter(exp => {
      // "Present" jobs are always included
      if (exp.period.includes('Present')) return true;
      
      // Parse start date from period (e.g., "Jan 2017 - Dec 2021" -> "Jan 2017")
      const parts = exp.period.split(' - ');
      if (parts.length === 2) {
        const startDateStr = parts[0].trim();
        const [month, year] = startDateStr.split(' ');
        const monthMap: { [key: string]: number } = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const startDate = new Date(parseInt(year), monthMap[month], 1);
        return startDate >= fiveYearsAgo;
      }
      return true; // Keep if can't parse
    });

    return filtered;
  }

  /**
   * Get profile variant for the current track
   */
  private getProfileVariant() {
    if (this.track === 'both') {
      return this.data.profile.variants.it;
    }
    return this.data.profile.variants[this.track];
  }

  /**
   * Get skills for current track
   */
  private getSkillsForTrack() {
    if (this.track === 'it') {
      return {
        frontend: this.data.skills.it.frontend,
        backend: this.data.skills.it.backend,
        infrastructure: this.data.skills.it.infrastructure,
      };
    } else if (this.track === 'translation') {
      return {
        technical: this.data.skills.translation.technical,
        languages: this.data.skills.translation.languages,
        specializations: this.data.skills.translation.specializations,
      };
    }
    return this.data.skills.it;
  }

  /**
   * Generate the resume PDF
   */
  async generate(): Promise<PDFGenerationResult> {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.jsPDF;

      this.doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false, // Don't compress to keep text selectable for ATS
      });

      const { profile, socials, languages } = this.data;
      const experience = this.getFilteredExperience();
      const profileVariant = this.getProfileVariant();
      const skills = this.getSkillsForTrack();

      // 1. HEADER
      const header = new ResumePDFHeader(this.doc);
      const contactInfo = [
        { label: 'Email', value: socials.email },
        { label: 'Location', value: profile.location },
        { label: 'GitHub', value: socials.github?.split('https://')[1] },
        { label: 'LinkedIn', value: socials.linkedin?.split('https://')[1] },
      ].filter((item) => item.value);

      let currentY = header.render(profile.firstName, profile.lastName, profileVariant.role, contactInfo);

      // 2. PROFESSIONAL SUMMARY
      const section = new ResumePDFSection(this.doc);
      currentY = section.renderSection('PROFESSIONAL SUMMARY', currentY);
      currentY = section.renderSummary(profileVariant.summary, currentY);

      // 3. PROFESSIONAL EXPERIENCE
      currentY = section.renderSection('PROFESSIONAL EXPERIENCE', currentY);
      for (const exp of experience) {
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
        profile.education,
        'Jomo Kenyatta University of Agriculture and Technology (JKUAT)',
        '2014-2018',
        currentY
      );

      // 5. TECHNICAL SKILLS
      currentY = section.renderSkillsSection(skills, currentY);

      // 6. LANGUAGES
      if (languages && languages.length > 0) {
        currentY = section.renderSection('LANGUAGES', currentY);
        // Language names already include proficiency level (e.g., "Swahili (Native)")
        const langText = languages.map((lang) => lang.name).join(', ');
        this.doc.setFontSize(8);
        this.doc.setTextColor(COLORS.secondary);
        this.doc.text(langText, CONSTANTS.MARGIN, currentY);
        currentY += CONSTANTS.SECTION_SPACING + 2;
      }

      // 7. FOOTER (Page numbers)
      const footer = new ResumePDFFooter(this.doc);
      footer.addPageFooters();

      // Save the PDF with track suffix
      const trackSuffix = this.track === 'both' ? '' : `_${this.track}`;
      const filename = `${profile.firstName}_${profile.lastName}_Resume${trackSuffix}.pdf`;
      this.doc.save(filename);

      return { success: true };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('PDF generation error:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }
}
