import { supabase } from '../../../../lib/supabase';

// Function to get a signed URL for a PPE icon
export const getSignedPPEImageUrl = async (filename: string): Promise<string | null> => {
  if (!filename) return null;
  
  try {
    const { data } = await supabase.storage
      .from('ppe-icons')
      .createSignedUrl(filename, 3600);
      
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating signed PPE URL:', error);
    return null;
  }
};

// Function to get a signed URL for a hazard icon
export const getSignedHazardImageUrl = async (filename: string): Promise<string | null> => {
  if (!filename) return null;
  
  try {
    const { data } = await supabase.storage
      .from('signage-artwork')
      .createSignedUrl(filename, 3600);
      
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error generating signed hazard URL:', error);
    return null;
  }
};

// Function to load and add company logo to PDF
export const addCompanyLogoToPDF = async (doc: any, logoUrl: string): Promise<void> => {
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
    // Continue without logo
  }
};

// Function to load image data for PDF tables
export const loadImageDataForPDF = async (signedUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(signedUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image data:', error);
    return null;
  }
};
