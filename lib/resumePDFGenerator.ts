/**
 * Resume PDF Generation Utility
 * Encapsulates complex PDF generation logic
 * Handles PDF creation, styling, and file download
 *
 * ARCHITECTURE:
 * - Pure utility function, no React dependencies
 * - Lazy-loads PDF libraries on demand
 * - Handles all PDF generation logic separate from UI
 * - Reusable across components
 */

import { portfolioData } from '@/portfolioData';

/**
 * Generate and download a resume PDF
 * Creates an ATS-friendly resume with professional formatting
 *
 * @throws {Error} If PDF generation fails
 */
export async function generateAndDownloadResumePDF(): Promise<void> {
  try {
    // Lazy load jsPDF on demand (only when needed)
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.jsPDF;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false, // Keep text selectable for ATS
    });

    // Lazy load PDF components
    const PDFHeaderModule = await import('@/lib/pdf/PDFHeader');
    const PDFSectionModule = await import('@/lib/pdf/PDFSection');
    const PDFFooterModule = await import('@/lib/pdf/PDFFooter');
    const PDFConfigModule = await import('@/lib/pdf/PDFConfig');

    const ResumePDFHeader = PDFHeaderModule.ResumePDFHeader;
    const ResumePDFSection = PDFSectionModule.ResumePDFSection;
    const ResumePDFFooter = PDFFooterModule.ResumePDFFooter;
    const CONSTANTS = PDFConfigModule.CONSTANTS;
    const COLORS = PDFConfigModule.COLORS;

    const { profile, socials, languages, experience, skills } = portfolioData;

    // 1. HEADER
    const header = new ResumePDFHeader(doc);
    const contactInfo = [
      { label: 'Email', value: socials.email },
      { label: 'Location', value: profile.location },
      { label: 'GitHub', value: socials.github?.split('https://')[1] },
      { label: 'LinkedIn', value: socials.linkedin?.split('https://')[1] },
    ].filter((item) => item.value);

    let currentY = header.render(
      profile.firstName,
      profile.lastName,
      profile.variants.it.role,
      contactInfo
    );

    // 2. PROFESSIONAL SUMMARY
    const section = new ResumePDFSection(doc);
    currentY = section.renderSection('PROFESSIONAL SUMMARY', currentY);
    currentY = section.renderSummary(profile.variants.it.summary, currentY);

    // 3. PROFESSIONAL EXPERIENCE
    currentY = section.renderSection('PROFESSIONAL EXPERIENCE', currentY);
    // Hide explicitly outdated roles (exp-3: IT Technician, exp-4: Android Developer)
    const hideInPdfIds = new Set(['exp-3', 'exp-4']);
    const filteredExperience = experience.filter((exp) => !hideInPdfIds.has(exp.id));
    for (const exp of filteredExperience) {
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
    currentY = section.renderSkillsSection(skills.it, currentY);

    // 6. LANGUAGES
    if (languages && languages.length > 0) {
      currentY = section.renderSection('LANGUAGES', currentY);
      const langText = languages.map((lang) => lang.name).join(', ');
      doc.setFontSize(8);
      doc.setTextColor(COLORS.secondary);
      doc.text(langText, CONSTANTS.MARGIN, currentY);
      currentY += CONSTANTS.SECTION_SPACING + 2;
    }

    // 7. FOOTER
    const footer = new ResumePDFFooter(doc);
    footer.addPageFooters();

    // Save the PDF with a descriptive filename
    const filename = `${profile.firstName}_${profile.lastName}_Resume.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to generate PDF. Please try again.'
    );
  }
}
