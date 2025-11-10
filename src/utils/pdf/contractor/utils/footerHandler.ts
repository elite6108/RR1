import { jsPDF } from 'jspdf';
import type { CompanySettings } from '../types';

export const addFooterToAllPages = (doc: jsPDF, companySettings: CompanySettings): void => {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // Add company details and page number in footer
    const footerParts = [];
    if (companySettings.company_number) {
      footerParts.push(`Company Number: ${companySettings.company_number}`);
    }
    if (companySettings.vat_number) {
      footerParts.push(`VAT Number: ${companySettings.vat_number}`);
    }

    if (footerParts.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(100);

      const footerText = footerParts.join('   ');
      const pageNumberText = `Page ${i} of ${pageCount}`;

      // Calculate positions
      const footerWidth = doc.getTextWidth(footerText);
      const pageNumberWidth = doc.getTextWidth(pageNumberText);

      // Draw footer text on the left and page number on the right
      doc.text(footerText, 15, pageHeight - 10); // Left margin of 15px
      doc.text(
        pageNumberText,
        pageWidth - pageNumberWidth - 15,
        pageHeight - 10
      ); // Right margin of 15px
    }
  }
};
