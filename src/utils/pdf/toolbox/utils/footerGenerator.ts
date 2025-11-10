import jsPDF from 'jspdf';
import type { CompanySettings } from '../../../../types/database';
import { PDF_LAYOUT } from './constants';

/**
 * Generates footer content with company details and page numbers
 */
export function generateFooter(
  doc: jsPDF,
  companySettings: CompanySettings
): void {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Prepare footer parts
    const footerParts = [];
    if (companySettings.company_number) {
      footerParts.push(`Company Number: ${companySettings.company_number}`);
    }
    if (companySettings.vat_number) {
      footerParts.push(`VAT Number: ${companySettings.vat_number}`);
    }
    
    if (footerParts.length > 0) {
      doc.setFontSize(PDF_LAYOUT.footer.fontSize);
      doc.setTextColor(100);
      
      const footerText = footerParts.join('   ');
      const pageNumberText = `Page ${i} of ${pageCount}`;
      
      // Calculate positions
      const footerWidth = doc.getTextWidth(footerText);
      const pageNumberWidth = doc.getTextWidth(pageNumberText);
      
      // Draw footer text on the left and page number on the right
      const yPosition = pageHeight - PDF_LAYOUT.footer.bottomMargin;
      doc.text(footerText, PDF_LAYOUT.margins.left, yPosition);
      doc.text(
        pageNumberText, 
        pageWidth - pageNumberWidth - PDF_LAYOUT.margins.right, 
        yPosition
      );
    }
  }
}
