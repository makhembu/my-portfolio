/**
 * lib/pdf/PDFConfig.ts
 * Shared PDF constants, colors, and utility functions
 * 
 * SPACING ARCHITECTURE:
 * - MARGIN: 12mm - Page margins on all sides
 * - LINE_HEIGHT: 3.8 - Vertical space per text line (accommodates dynamic content)
 * - ITEM_SPACING: 2 - Gap between items within a section (e.g., between bullet points)
 * - SECTION_SPACING: 4 - Gap between major sections (Professional Summary → Experience → Education → Skills → Languages)
 * 
 * The spacing hierarchy ensures consistent vertical flow:
 * 1. Header divider → PROFESSIONAL SUMMARY: 6.5mm (from PDFHeader)
 * 2. PROFESSIONAL SUMMARY → PROFESSIONAL EXPERIENCE: 4mm (SECTION_SPACING)
 * 3. PROFESSIONAL EXPERIENCE → EDUCATION: 4mm (SECTION_SPACING)
 * 4. EDUCATION → SKILLS: 4mm (SECTION_SPACING)
 * 5. SKILLS → LANGUAGES: 4mm (SECTION_SPACING)
 */

export const CONSTANTS = {
  MARGIN: 12,
  MARGIN_TOP: 12,
  MARGIN_LEFT: 12,
  MARGIN_RIGHT: 12,
  MARGIN_BOTTOM: 12,
  LINE_HEIGHT: 3.8,
  SECTION_SPACING: 4,
  ITEM_SPACING: 2,
};

export const COLORS = {
  primary: '#000000',
  secondary: '#333333',
  accent: '#4f46e5',
  lightGray: '#666666',
  veryLightGray: '#ddd',
  white: '#ffffff',
  border: '#e5e7eb',
};

export const FONTS = {
  name: { size: 18, weight: 'bold' },
  sectionTitle: { size: 10, weight: 'bold' },
  jobTitle: { size: 9, weight: 'bold' },
  jobCompany: { size: 8, weight: 'normal' },
  body: { size: 8, weight: 'normal' },
  small: { size: 7, weight: 'normal' },
  categoryLabel: { size: 7, weight: 'bold' },
};

export function formatDateUK(date: string | Date): string {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Split text to fit within a certain width
 */
export function splitText(text: string, doc: any, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}
