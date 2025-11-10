import { jsPDF } from 'jspdf';
import type { CompanySettings } from '../../../../types/database';

export function addPageNumbersAndFooter(doc: jsPDF, companySettings: CompanySettings): void {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Add company details and page number in footer
    const footerParts = [];
    if (companySettings.vat_number) {
      footerParts.push(`VAT Number: ${companySettings.vat_number}`);
    }
    if (companySettings.company_number) {
      footerParts.push(`Company Number: ${companySettings.company_number}`);
    }
    
    if (footerParts.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(100);
      
      const footerText = footerParts.join('   ');
      const pageNumberText = `Page ${i} of ${pageCount}`;
      
      // Calculate positions
      const footerWidth = doc.getTextWidth(footerText);
      const pageNumberWidth = doc.getTextWidth(pageNumberText);
      const totalWidth = footerWidth + pageNumberWidth + 20; // 20px spacing between
      const startX = (pageWidth - totalWidth) / 2;
      
      // Draw footer text and page number
      doc.text(footerText, startX, pageHeight - 10);
      doc.text(pageNumberText, startX + footerWidth + 20, pageHeight - 10);
    }
  }
}