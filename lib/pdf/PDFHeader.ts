/**
 * lib/pdf/PDFHeader.ts
 * Resume header with name, role, contact info
 */

import { CONSTANTS, COLORS, FONTS } from './PDFConfig';

export interface HeaderMetadata {
  label: string;
  value: string;
  icon?: string;
}

export class ResumePDFHeader {
  private doc: any;
  private width: number;
  private margin: number;

  constructor(doc: any) {
    this.doc = doc;
    this.width = doc.internal.pageSize.getWidth();
    this.margin = CONSTANTS.MARGIN;
  }

  /**
   * Render header with name, role, and contact info
   * Returns Y position after header
   */
  public render(
    firstName: string,
    lastName: string,
    role: string,
    contactInfo: HeaderMetadata[],
    currentY: number = this.margin
  ): number {
    let y = currentY;
    const nameLineHeight = FONTS.name.size * 0.35;
    const roleLineHeight = FONTS.sectionTitle.size * 0.35;
    const bodyLineHeight = CONSTANTS.LINE_HEIGHT;

    // Name with last name in accent color
    this.doc.setFontSize(FONTS.name.size);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(COLORS.primary);
    this.doc.text(`${firstName}`, this.margin, y);
    
    // Last name in accent color
    const firstNameWidth = this.doc.getTextWidth(`${firstName}`);
    this.doc.setTextColor(COLORS.accent);
    this.doc.text(` ${lastName}`, this.margin + firstNameWidth, y);
    
    y += nameLineHeight + 1;

    // Role / Title
    this.doc.setFontSize(FONTS.sectionTitle.size);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(COLORS.accent);
    this.doc.text(role.toUpperCase(), this.margin, y);
    y += roleLineHeight + 1;

    // Contact info on single line
    this.doc.setFontSize(FONTS.body.size);
    this.doc.setTextColor(COLORS.secondary);
    const contactText = contactInfo.map((info) => `${info.value}`).join(' • ');
    const contactLines = this.doc.splitTextToSize(contactText, this.width - this.margin * 2);
    this.doc.text(contactLines, this.margin, y);
    y += contactLines.length * bodyLineHeight + 1.5;

    // Divider line (thicker)
    this.doc.setDrawColor(COLORS.accent);
    this.doc.setLineWidth(0.8);
    this.doc.line(this.margin, y, this.width - this.margin, y);
    this.doc.setLineWidth(0.2); // Reset
    y += 6.5; // Space between header divider and first section title

    return y;
  }
}
