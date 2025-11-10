import { jsPDF } from 'jspdf';
import type { CompanySettings } from '../../../../types/database';

export async function addCompanyLogo(doc: jsPDF, companySettings: CompanySettings): Promise<void> {
  if (companySettings.logo_url) {
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
              // Calculate dimensions to maintain aspect ratio
              const maxWidth = 40;
              const maxHeight = 20;
              const aspectRatio = 300/91; // Default aspect ratio
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
      // Continue without logo
    }
  }
}