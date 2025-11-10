import jsPDF from 'jspdf';
import type { CompanySettings } from '../types';
import { FONT_CONFIG, LAYOUT_CONFIG } from './constants';

/**
 * Adds page numbers and footer information to all pages of the PDF
 * @param doc - jsPDF document instance
 * @param companySettings - Company settings for footer information
 */
export function addFooterToAllPages(
  doc: jsPDF,
  companySettings: CompanySettings
): void {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooterToPage(doc, companySettings, i, pageCount);
  }
}

/**
 * Adds footer information to a specific page
 * @param doc - jsPDF document instance
 * @param companySettings - Company settings for footer information
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 */
function addFooterToPage(
  doc: jsPDF,
  companySettings: CompanySettings,
  currentPage: number,
  totalPages: number
): void {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  // Build footer parts array
  const footerParts = buildFooterParts(companySettings);
  
  if (footerParts.length === 0) {
    return;
  }
  
  // Set footer styling
  doc.setFontSize(FONT_CONFIG.footerSize);
  doc.setTextColor(100);
  
  const footerText = footerParts.join('   ');
  const pageNumberText = `Page ${currentPage} of ${totalPages}`;
  
  // Calculate positions
  const pageNumberWidth = doc.getTextWidth(pageNumberText);
  
  // Draw footer text on the left and page number on the right
  doc.text(footerText, LAYOUT_CONFIG.leftMargin, pageHeight - LAYOUT_CONFIG.footerMargin);
  doc.text(pageNumberText, pageWidth - pageNumberWidth - LAYOUT_CONFIG.rightMargin, pageHeight - LAYOUT_CONFIG.footerMargin);
}

/**
 * Builds an array of footer parts from company settings
 * @param companySettings - Company settings data
 * @returns Array of footer text parts
 */
function buildFooterParts(companySettings: CompanySettings): string[] {
  const footerParts: string[] = [];
  
  if (companySettings.company_number) {
    footerParts.push(`Company Number: ${companySettings.company_number}`);
  }
  
  if (companySettings.vat_number) {
    footerParts.push(`VAT Number: ${companySettings.vat_number}`);
  }
  
  return footerParts;
}
