import jsPDF from 'jspdf';
import type { CompanySettings } from '../../../../types/database';
import type { LogoDimensions } from '../types';
import { PDF_LAYOUT } from './constants';

/**
 * Calculates logo dimensions while maintaining aspect ratio
 */
export function calculateLogoDimensions(
  aspectRatio: number = PDF_LAYOUT.logo.defaultAspectRatio
): LogoDimensions {
  const { maxWidth, maxHeight, x, y } = PDF_LAYOUT.logo;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return { width, height, x, y };
}

/**
 * Loads and adds company logo to PDF document
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
              dimensions.x,
              dimensions.y,
              dimensions.width,
              dimensions.height,
              undefined,
              'FAST'
            );
          }
          resolve();
        } catch (error) {
          reject(new Error(
            `Failed to add logo to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
          ));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read logo file'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading company logo:', error);
    // Continue without logo - don't throw to avoid breaking PDF generation
  }
}
