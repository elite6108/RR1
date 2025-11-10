import jsPDF from 'jspdf';
import type { CompanySettings } from '../../types/database';

// Add company logo to PDF
export const addCompanyLogo = async (doc: jsPDF, companySettings: CompanySettings): Promise<void> => {
  if (!companySettings.logo_url) return;

  try {
    const response = await fetch(companySettings.logo_url);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise((resolve, reject) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            const maxWidth = 40;
            const maxHeight = 20;
            const aspectRatio = 300/91;
            let width = maxWidth;
            let height = width / aspectRatio;
            
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }

            doc.addImage(
              reader.result as string,
              'PNG',
              15,
              15,
              width,
              height,
              undefined,
              'FAST'
            );
          }
          resolve(null);
        } catch (error) {
          reject(new Error(`Failed to add logo to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read logo file'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading company logo:', error);
  }
};

// Add PDF title
export const addTitle = (doc: jsPDF, themeColor: string): void => {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor);
  doc.text('CPP', 195, 25, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
};

// Add page numbers and footer
export const addPageFooters = (doc: jsPDF, companySettings: CompanySettings): void => {
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
      doc.text(pageNumberText, pageWidth - pageNumberWidth - 15, pageHeight - 10); // Right margin of 15px
    }
  }
};
