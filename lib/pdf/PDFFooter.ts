/**
 * lib/pdf/PDFFooter.ts
 * Resume footer with page numbers
 */

import { CONSTANTS, COLORS, FONTS } from './PDFConfig';

export class ResumePDFFooter {
  private doc: any;
  private width: number;
  private height: number;
  private margin: number;

  constructor(doc: any) {
    this.doc = doc;
    this.width = doc.internal.pageSize.getWidth();
    this.height = doc.internal.pageSize.getHeight();
    this.margin = CONSTANTS.MARGIN;
  }

  /**
   * Add page footers to all pages
   */
  public addPageFooters(): void {
    const totalPages = this.doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.renderPageFooter(i, totalPages);
    }
  }

  /**
   * Render footer for a single page
   */
  private renderPageFooter(pageNum: number, totalPages: number): void {
    const y = this.height - this.margin + 2;

    this.doc.setFontSize(FONTS.small.size);
    this.doc.setTextColor(COLORS.lightGray);
    this.doc.setFont(undefined, 'normal');

    // Page number
    const pageText = totalPages > 1 ? `Page ${pageNum} of ${totalPages}` : '';
    if (pageText) {
      this.doc.text(pageText, this.width / 2, y, { align: 'center' });
    }
  }
}
