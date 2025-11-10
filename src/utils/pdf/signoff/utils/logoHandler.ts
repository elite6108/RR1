import jsPDF from 'jspdf';
import { PDF_THEME } from './constants';

/**
 * Adds company logo to the PDF document
 * @param doc - The jsPDF document instance
 * @param logoUrl - URL of the company logo
 * @returns Promise that resolves when logo is added or skipped
 */
export async function addCompanyLogo(doc: jsPDF, logoUrl: string | null | undefined): Promise<void> {
  if (!logoUrl) {
    return;
  }

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
            const { maxWidth, maxHeight, defaultAspectRatio, position } = PDF_THEME.layout.logo;
            
            let width = maxWidth;
            let height = width / defaultAspectRatio;
            
            if (height > maxHeight) {
              height = maxHeight;
              width = height * defaultAspectRatio;
            }

            doc.addImage(
              reader.result as string,
              'PNG',
              position.x,
              position.y,
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
