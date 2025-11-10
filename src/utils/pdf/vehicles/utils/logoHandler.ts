import jsPDF from 'jspdf';
import type { CompanySettings } from '../types';
import { LOGO_CONFIG } from './constants';

/**
 * Adds company logo to the PDF document
 * @param doc - jsPDF document instance
 * @param companySettings - Company settings containing logo URL
 * @returns Promise<void>
 */
export async function addCompanyLogo(
  doc: jsPDF, 
  companySettings: CompanySettings
): Promise<void> {
  if (!companySettings.logo_url) {
    return;
  }

  try {
    const response = await fetch(companySettings.logo_url);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise<void>((resolve, reject) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            const dimensions = calculateLogoDimensions();
            
            doc.addImage(
              reader.result as string,
              'PNG',
              15,
              15,
              dimensions.width,
              dimensions.height,
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
    // Continue without logo - don't throw error to prevent PDF generation failure
  }
}

/**
 * Calculates logo dimensions while maintaining aspect ratio
 * @returns Object containing width and height
 */
function calculateLogoDimensions(): { width: number; height: number } {
  const { maxWidth, maxHeight, aspectRatio } = LOGO_CONFIG;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return { width, height };
}

/**
 * Sets up the PDF document with default font and styling
 * @param doc - jsPDF document instance
 */
export function setupPDFDefaults(doc: jsPDF): void {
  doc.setFont('helvetica');
}

/**
 * Adds the main title to the PDF
 * @param doc - jsPDF document instance
 * @param title - Title text to add
 * @param themeColor - Color for the title
 */
export function addPDFTitle(
  doc: jsPDF, 
  title: string, 
  themeColor: string
): void {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor);
  doc.text(title, 195, 25, { align: 'right' });
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}
