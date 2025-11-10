import { supabase } from '../../../../lib/supabase';
import { PPE_FILENAMES } from './constants';

// Function to get a signed URL for a PPE icon
export const getSignedImageUrl = async (filename: string) => {
  if (!filename) return null;
  
  try {
    const { data } = await supabase.storage
      .from('ppe-icons')
      .createSignedUrl(filename, 3600);
      
    return data?.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

// Function to load company logo
export const loadCompanyLogo = async (logoUrl: string, doc: any) => {
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
};

// Function to create PPE item with image
export const createPPEItem = async (item: string, pageWidth: number, maxColumns: number, cellBackgroundColor: string) => {
  const filename = PPE_FILENAMES[item as keyof typeof PPE_FILENAMES];
  if (!filename) {
    console.error(`No filename found for PPE item: ${item}`);
    return {
      content: item,
      styles: {
        fillColor: cellBackgroundColor,
        halign: 'center',
        valign: 'middle',
        cellPadding: 5,
        cellWidth: (pageWidth - 30) / maxColumns
      }
    };
  }

  try {
    const signedUrl = await getSignedImageUrl(filename);
    if (!signedUrl) throw new Error('Failed to get signed URL');

    const response = await fetch(signedUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    const reader = new FileReader();
    const imageData = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return {
      content: `\n\n\n${item}`,
      styles: {
        fillColor: cellBackgroundColor,
        halign: 'center',
        valign: 'middle',
        cellPadding: { top: 25, bottom: 5, left: 3, right: 3 },
        cellWidth: (pageWidth - 30) / maxColumns
      },
      image: imageData,
      imageOptions: {
        imageData,
        x: 0,
        y: 0,
        width: 20,
        height: 20
      }
    };
  } catch (error) {
    console.error(`Error loading PPE image for ${item}:`, error);
    return {
      content: item,
      styles: {
        fillColor: cellBackgroundColor,
        halign: 'center',
        valign: 'middle',
        cellPadding: 5,
        cellWidth: (pageWidth - 30) / maxColumns
      }
    };
  }
};

// Function to add footer to all pages
export const addFooterToPages = (doc: any, companySettings: any) => {
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
