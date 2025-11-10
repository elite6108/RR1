import jsPDF from 'jspdf';
import { supabase } from '../../../../lib/supabase';
import type { CompanySettings, PDFTheme, PDFDimensions } from '../types';

/**
 * PDF Theme and styling constants
 */
export const PDF_THEME: PDFTheme = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  detailsHeaderColor: '#edeaea',
  borderColor: [211, 211, 211], // Light gray border
};

/**
 * Calculate PDF dimensions based on page width
 */
export function calculatePDFDimensions(doc: jsPDF): PDFDimensions {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15; // Left margin
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

  return {
    pageWidth,
    leftColumnX,
    rightColumnX,
    boxWidth,
  };
}

/**
 * Fetch company settings from Supabase
 */
export async function fetchCompanySettings(): Promise<CompanySettings> {
  const { data: companySettings, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (companyError) {
    throw new Error(
      `Failed to load company settings: ${companyError.message}`
    );
  }
  
  if (!companySettings) {
    throw new Error('Company settings not found');
  }

  return companySettings;
}

/**
 * Add company logo to PDF document
 */
export async function addCompanyLogo(
  doc: jsPDF,
  logoUrl: string
): Promise<void> {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const reader = new FileReader();

    await new Promise<void>((resolve, reject) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            // Calculate dimensions to maintain aspect ratio
            const maxWidth = 40;
            const maxHeight = 20;
            const aspectRatio = 300 / 91; // Default aspect ratio
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
          resolve();
        } catch (error) {
          reject(
            new Error(
              `Failed to add logo to PDF: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
        }
      };
      reader.onerror = () => reject(new Error('Failed to read logo file'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading company logo:', error);
    // Continue without logo - don't throw error
  }
}

/**
 * Initialize PDF document with basic settings
 */
export function initializePDF(): jsPDF {
  const doc = new jsPDF();
  
  // Set default font
  doc.setFont('helvetica');
  
  return doc;
}

/**
 * Add PDF title to document
 */
export function addPDFTitle(doc: jsPDF, title: string): void {
  const { themeColor } = PDF_THEME;
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor);
  doc.text(title, 195, 25, { align: 'right' });
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}

/**
 * Add page numbers and footer to all pages
 */
export function addPageNumbersAndFooter(
  doc: jsPDF,
  companySettings: CompanySettings
): void {
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
}

/**
 * Get common table styles for consistency
 */
export function getTableStyles() {
  const { headerColor, cellBackgroundColor, borderColor } = PDF_THEME;
  
  return {
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    theme: 'grid' as const,
  };
}
