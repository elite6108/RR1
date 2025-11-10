import jsPDF from 'jspdf';
import { PDF_THEME } from './constants';
import type { CompanyInfo } from '../types';

/**
 * Adds page numbers and footer information to all pages of the PDF
 * @param doc - The jsPDF document instance
 * @param companySettings - Company settings containing footer information
 */
export function addFooterToAllPages(doc: jsPDF, companySettings: CompanyInfo): void {
  const pageCount = doc.getNumberOfPages();
  const { colors, fonts, layout } = PDF_THEME;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Prepare footer content - ensure values are strings
    const footerParts: string[] = [];
    if (companySettings.company_number) {
      footerParts.push(`Company Number: ${String(companySettings.company_number)}`);
    }
    if (companySettings.vat_number) {
      footerParts.push(`VAT Number: ${String(companySettings.vat_number)}`);
    }
    
    // Only add footer if there's content to display
    if (footerParts.length > 0) {
      doc.setFontSize(fonts.size.footer);
      doc.setTextColor(colors.footerText);
      
      const footerText = footerParts.join('   ');
      const pageNumberText = `Page ${i} of ${pageCount}`;
      
      // Calculate positions
      const pageNumberWidth = doc.getTextWidth(pageNumberText);
      const yPosition = pageHeight - layout.margins.footer;
      
      // Draw footer text on the left and page number on the right
      doc.text(footerText, layout.margins.left, yPosition);
      doc.text(pageNumberText, pageWidth - pageNumberWidth - layout.margins.right, yPosition);
    }
  }
}
