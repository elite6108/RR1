import jsPDF from 'jspdf';
import { supabase } from '../../../../lib/supabase';
import type { CompanySettings, PDFTheme, PDFDimensions, LogoOptions, FooterData } from '../types';

/**
 * PDF styling constants and theme configuration
 */
export const PDF_THEME: PDFTheme = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  borderColor: [211, 211, 211] // Light gray border
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
    boxWidth
  };
}

/**
 * Default logo configuration
 */
export const DEFAULT_LOGO_OPTIONS: LogoOptions = {
  maxWidth: 40,
  maxHeight: 20,
  aspectRatio: 300/91, // Default aspect ratio
  x: 15,
  y: 15
};

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
    throw new Error(`Failed to load company settings: ${companyError.message}`);
  }
  
  if (!companySettings) {
    throw new Error('Company settings not found');
  }

  return companySettings;
}

/**
 * Load and add company logo to PDF document
 */
export async function addCompanyLogo(
  doc: jsPDF, 
  logoUrl: string, 
  options: LogoOptions = DEFAULT_LOGO_OPTIONS
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
            let width = options.maxWidth;
            let height = width / options.aspectRatio;
            
            if (height > options.maxHeight) {
              height = options.maxHeight;
              width = height * options.aspectRatio;
            }

            doc.addImage(
              reader.result as string,
              'PNG',
              options.x,
              options.y,
              width,
              height,
              undefined,
              'FAST'
            );
          }
          resolve();
        } catch (error) {
          reject(new Error(`Failed to add logo to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
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
 * Add PDF title with styling
 */
export function addPDFTitle(doc: jsPDF, title: string = 'EQUIPMENT CHECKLIST'): void {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PDF_THEME.themeColor);
  doc.text(title, 195, 25, { align: 'right' });
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}

/**
 * Extract footer data from company settings
 */
export function extractFooterData(companySettings: CompanySettings): FooterData {
  return {
    companyNumber: companySettings.company_number,
    vatNumber: companySettings.vat_number
  };
}

/**
 * Add page numbers and footer to all pages
 */
export function addPageFooters(doc: jsPDF, footerData: FooterData): void {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Add company details and page number in footer
    const footerParts: string[] = [];
    
    if (footerData.companyNumber) {
      footerParts.push(`Company Number: ${footerData.companyNumber}`);
    }
    if (footerData.vatNumber) {
      footerParts.push(`VAT Number: ${footerData.vatNumber}`);
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
}
