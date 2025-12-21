/**
 * lib/pdf/PDFSection.ts
 * Render section with title and content
 */

import { CONSTANTS, COLORS, FONTS } from './PDFConfig';

export class ResumePDFSection {
  private doc: any;
  private width: number;
  private height: number;
  private margin: number;
  private maxWidth: number;

  constructor(doc: any) {
    this.doc = doc;
    this.width = doc.internal.pageSize.getWidth();
    this.height = doc.internal.pageSize.getHeight();
    this.margin = CONSTANTS.MARGIN;
    this.maxWidth = this.width - this.margin * 2;
  }

  /**
   * Render a section title
   */
  private renderSectionTitle(title: string, y: number): number {
    const titleFontSize = FONTS.sectionTitle.size;
    const titleHeight = titleFontSize * 0.35;
    
    this.doc.setFontSize(titleFontSize);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(title.toUpperCase(), this.margin, y);

    // Underline with accent color - positioned directly under text
    this.doc.setDrawColor(COLORS.accent);
    this.doc.setLineWidth(0.3);
    const underlineY = y + 1; // Underline position
    this.doc.line(this.margin, underlineY, this.margin + 30, underlineY);
    this.doc.setLineWidth(0.2); // Reset

    // Return position after underline with gap to prevent overlap with content
    return underlineY + 7.5;
  }

  /**
   * Render experience item (job)
   */
  public renderExperienceItem(
    jobTitle: string,
    company: string,
    period: string,
    descriptions: string[],
    currentY: number
  ): number {
    let y = currentY;
    const pageHeight = this.height;
    const pageWidth = this.width;
    const lineHeight = CONSTANTS.LINE_HEIGHT;

    // Job title on left, period on right
    this.doc.setFontSize(FONTS.jobTitle.size);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(jobTitle, this.margin, y);

    // Period on the right
    this.doc.setFontSize(7);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(COLORS.lightGray);
    this.doc.text(period, this.margin + 160, y);

    y += lineHeight + CONSTANTS.ITEM_SPACING;

    // Company in accent color
    this.doc.setFontSize(FONTS.jobCompany.size);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(COLORS.accent);
    this.doc.text(company, this.margin, y);
    y += lineHeight + CONSTANTS.ITEM_SPACING;

    // Bullet points
    this.doc.setFontSize(FONTS.body.size);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(COLORS.secondary);

    for (const desc of descriptions) {
      // Check if we need new page
      if (y > pageHeight - this.margin - 15) {
        this.doc.addPage();
        y = this.margin;
      }

      const lines = this.doc.splitTextToSize(`• ${desc}`, this.maxWidth - 5);
      this.doc.text(lines, this.margin + 3, y);
      y += lines.length * lineHeight + CONSTANTS.ITEM_SPACING;
    }

    return y + CONSTANTS.SECTION_SPACING;
  }

  /**
   * Render education item
   */
  public renderEducationItem(degree: string, school: string, year: string, currentY: number): number {
    let y = currentY;
    const lineHeight = CONSTANTS.LINE_HEIGHT;

    this.doc.setFontSize(FONTS.jobTitle.size);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(degree, this.margin, y);

    this.doc.setFontSize(FONTS.jobCompany.size);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(COLORS.lightGray);
    this.doc.text(`${school} | ${year}`, this.margin, y + lineHeight + CONSTANTS.ITEM_SPACING);

    return y + (lineHeight * 2) + CONSTANTS.ITEM_SPACING + CONSTANTS.SECTION_SPACING;
  }

  /**
   * Render skills section in 3 columns
   */
  public renderSkillsSection(skillsData: { [key: string]: string[] }, currentY: number): number {
    const pageHeight = this.height;
    const lineHeight = CONSTANTS.LINE_HEIGHT;
    
    // Check if we need new page - only force page break if absolutely necessary (< 45mm remaining)
    if (currentY > pageHeight - this.margin - 45) {
      this.doc.addPage();
      currentY = this.margin;
    }

    currentY = this.renderSectionTitle('SKILLS', currentY);

    const categories = Object.entries(skillsData);
    const pageWidth = this.width;
    const colWidth = (this.maxWidth - 6) / 3; // 3 columns with small gaps
    const colX1 = this.margin;
    const colX2 = this.margin + colWidth + 2;
    const colX3 = this.margin + colWidth * 2 + 4;

    // Track max height across columns
    let maxHeight = 0;

    // Render skills in 3-column layout
    for (let i = 0; i < categories.length; i++) {
      const [category, skills] = categories[i];
      let x = colX1;
      let colY = currentY;
      
      if (i === 1) x = colX2;
      if (i === 2) x = colX3;

      // Category label
      this.doc.setFontSize(FONTS.categoryLabel.size);
      this.doc.setFont(undefined, 'bold');
      this.doc.setTextColor(COLORS.accent);
      this.doc.text(category.toUpperCase(), x, colY);

      // Skills text
      this.doc.setFontSize(FONTS.body.size);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(COLORS.secondary);
      const skillsText = skills.join(', ');
      const skillsLines = this.doc.splitTextToSize(skillsText, colWidth - 1);
      this.doc.text(skillsLines, x, colY + lineHeight + CONSTANTS.ITEM_SPACING);
      
      // Calculate column height
      const colHeight = lineHeight + CONSTANTS.ITEM_SPACING + (skillsLines.length * lineHeight);
      maxHeight = Math.max(maxHeight, colHeight);
    }

    // Move Y position based on tallest column
    return currentY + maxHeight + CONSTANTS.SECTION_SPACING;
  }

  /**
   * Render any section with title and content
   */
  public renderSection(title: string, currentY: number): number {
    return this.renderSectionTitle(title, currentY);
  }

  /**
   * Render summary/text section
   * Returns Y position with consistent section spacing
   */
  public renderSummary(text: string, currentY: number): number {
    const lineHeight = CONSTANTS.LINE_HEIGHT;
    this.doc.setFontSize(FONTS.body.size);
    this.doc.setTextColor(COLORS.secondary);
    const lines = this.doc.splitTextToSize(text, this.maxWidth);
    this.doc.text(lines, this.margin, currentY);
    // Consistent spacing: content height + section spacing gap
    return currentY + lines.length * lineHeight + CONSTANTS.SECTION_SPACING;
  }
}
