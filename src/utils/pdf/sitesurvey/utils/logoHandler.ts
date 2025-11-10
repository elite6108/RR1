import jsPDF from 'jspdf';
import { layoutConstants } from './constants';

/**
 * Handles company logo processing and addition to PDF
 */
export async function addCompanyLogo(doc: jsPDF, logoUrl: string): Promise<void> {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise((resolve, reject) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            // Calculate dimensions to maintain aspect ratio
            const { logoMaxWidth, logoMaxHeight, logoDefaultAspectRatio, logoPosition } = layoutConstants;
            
            let width = logoMaxWidth;
            let height = width / logoDefaultAspectRatio;
            
            if (height > logoMaxHeight) {
              height = logoMaxHeight;
              width = height * logoDefaultAspectRatio;
            }

            doc.addImage(
              reader.result as string,
              'PNG',
              logoPosition.x,
              logoPosition.y,
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
    // Continue without logo - don't throw error
  }
}

/**
 * Sets up the PDF document with basic styling and title
 */
export function setupPDFDocument(doc: jsPDF): void {
  // Set default font
  doc.setFont('helvetica');
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#000000');
  doc.text('SITE SURVEY REPORT', layoutConstants.titlePosition.x, layoutConstants.titlePosition.y, { align: 'right' });
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}
