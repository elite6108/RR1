import jsPDF from 'jspdf';
import { PDF_THEME } from './pdfHelpers';

/**
 * Adds additional images section header to PDF
 */
export function addImagesHeader(doc: jsPDF, yPos: number): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [['ADDITIONAL IMAGES']],
    body: [
      ['PDF or other documents should be attached separately to this report. Uploaded images will appear inside of this report.']
    ],
    headStyles: {
      fillColor: PDF_THEME.headerColor,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: PDF_THEME.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: PDF_THEME.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 15;
}

/**
 * Calculates image dimensions maintaining aspect ratio
 */
export function calculateImageDimensions(originalWidth: number, originalHeight: number): { width: number; height: number } {
  const maxWidthPx = 700;
  const maxWidthMm = 185; // Maximum width in mm (A4 width minus margins)
  
  let displayWidth = maxWidthMm;
  let displayHeight = (originalHeight / originalWidth) * maxWidthMm;
  
  // If original is smaller than max, use original size converted to mm
  if (originalWidth < maxWidthPx) {
    displayWidth = (originalWidth / maxWidthPx) * maxWidthMm;
    displayHeight = (originalHeight / maxWidthPx) * maxWidthMm;
  }

  return { width: displayWidth, height: displayHeight };
}

/**
 * Processes and adds a single image to PDF
 */
export async function processAndAddImage(doc: jsPDF, imageUrl: string, yPos: number): Promise<number> {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return yPos;

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch image: ${imageUrl}`);
      return yPos;
    }

    const blob = await response.blob();
    const reader = new FileReader();
    
    return await new Promise((resolve) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            // Create an image to get dimensions
            const img = new Image();
            img.onload = () => {
              try {
                // Calculate dimensions maintaining aspect ratio
                const { width: displayWidth, height: displayHeight } = calculateImageDimensions(img.width, img.height);
                
                // Check if image fits on current page, if not add new page
                const currentPageHeight = doc.internal.pageSize.height;
                let currentYPos = yPos;
                
                if (currentYPos + displayHeight > currentPageHeight - 30) { // 30mm margin from bottom
                  doc.addPage();
                  currentYPos = 25;
                }

                // Add the image to PDF
                const imageFormat = imageUrl.toLowerCase().includes('.png') ? 'PNG' : 'JPEG';
                doc.addImage(
                  reader.result as string,
                  imageFormat,
                  15, // Left margin
                  currentYPos,
                  displayWidth,
                  displayHeight,
                  undefined,
                  'FAST'
                );

                // Update yPos for next image
                const newYPos = currentYPos + displayHeight + 10; // 10mm spacing between images
                resolve(newYPos);
              } catch (error) {
                console.error('Error adding image to PDF:', error);
                resolve(yPos);
              }
            };
            
            img.onerror = () => {
              console.warn('Failed to load image for dimension calculation');
              resolve(yPos);
            };
            
            img.src = reader.result as string;
          }
        } catch (error) {
          console.error('Error processing image:', error);
          resolve(yPos);
        }
      };
      
      reader.onerror = () => {
        console.warn('Failed to read image file');
        resolve(yPos);
      };
      
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.error('Error processing image URL:', imageUrl, error);
    return yPos;
  }
}

/**
 * Processes all images and adds them to PDF
 */
export async function processAllImages(doc: jsPDF, fileUrls: string[], yPos: number): Promise<void> {
  if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
    return;
  }

  // Check if we need a new page for the images section
  const pageHeight = doc.internal.pageSize.height;
  let currentYPos = yPos;
  
  if (currentYPos > pageHeight - 100) { // If less than 100 units from bottom, add new page
    doc.addPage();
    currentYPos = 25;
  }

  // Add Additional Images section header
  currentYPos = addImagesHeader(doc, currentYPos);

  // Process each image
  for (const imageUrl of fileUrls) {
    currentYPos = await processAndAddImage(doc, imageUrl, currentYPos);
  }
}
