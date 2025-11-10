import jsPDF from 'jspdf';
import { imageConstants, fontSettings } from './constants';
import type { ImageDimensions, ImageProcessingOptions } from '../types';

/**
 * Calculates optimal image dimensions maintaining aspect ratio
 */
function calculateImageDimensions(
  img: HTMLImageElement,
  options: ImageProcessingOptions
): ImageDimensions {
  const { maxWidth, maxHeight, pageWidth } = options;
  let { width, height } = img;
  const aspectRatio = width / height;
  
  // Scale to fit within max dimensions while maintaining aspect ratio
  if (width > height) {
    // Landscape orientation
    width = Math.min(maxWidth, pageWidth - imageConstants.pageMargin);
    height = width / aspectRatio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
  } else {
    // Portrait orientation
    height = maxHeight;
    width = height * aspectRatio;
    if (width > Math.min(maxWidth, pageWidth - imageConstants.pageMargin)) {
      width = Math.min(maxWidth, pageWidth - imageConstants.pageMargin);
      height = width / aspectRatio;
    }
  }
  
  return { width, height, aspectRatio };
}

/**
 * Processes and adds a single image to the PDF
 */
async function processImage(
  doc: jsPDF,
  imageUrl: string,
  yPos: number,
  caption: string
): Promise<number> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    return await new Promise<number>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          if (reader.result) {
            const img = new Image();
            img.onload = () => {
              try {
                const pageWidth = doc.internal.pageSize.width - imageConstants.pageMargin;
                const dimensions = calculateImageDimensions(img, {
                  maxWidth: imageConstants.maxWidth,
                  maxHeight: imageConstants.maxHeight,
                  pageWidth: doc.internal.pageSize.width
                });
                
                let currentYPos = yPos;
                
                // Check if we need a new page
                if (currentYPos + dimensions.height > doc.internal.pageSize.height - imageConstants.bottomMargin) {
                  doc.addPage();
                  currentYPos = imageConstants.newPageYPosition;
                }
                
                // Add image to PDF
                doc.addImage(
                  reader.result as string,
                  'JPEG',
                  15,
                  currentYPos,
                  dimensions.width,
                  dimensions.height,
                  undefined,
                  'FAST'
                );
                
                // Add image caption
                doc.setFontSize(imageConstants.captionFontSize);
                doc.setTextColor(100);
                doc.text(caption, 15, currentYPos + dimensions.height + imageConstants.captionOffset);
                doc.setTextColor(0);
                
                resolve(currentYPos + dimensions.height + imageConstants.imageSpacing);
              } catch (error) {
                reject(error);
              }
            };
            img.onerror = () => reject(new Error('Failed to load image for sizing'));
            img.src = reader.result as string;
          } else {
            reject(new Error('No image data'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error loading image:`, error);
    // Add error text instead of image
    doc.setFontSize(fontSettings.defaultSize);
    doc.setTextColor(200, 0, 0);
    doc.text(`${caption}: Could not be loaded`, 15, yPos);
    doc.setTextColor(0);
    return yPos + imageConstants.imageSpacing;
  }
}

/**
 * Processes multiple images sequentially for site access
 */
export async function processSiteAccessImages(
  doc: jsPDF,
  images: string[],
  startYPos: number
): Promise<number> {
  let currentYPos = startYPos;
  
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    const caption = `Site Access Image ${i + 1}`;
    currentYPos = await processImage(doc, imageUrl, currentYPos, caption);
  }
  
  return currentYPos;
}

/**
 * Processes multiple images sequentially for services
 */
export async function processServicesImages(
  doc: jsPDF,
  images: string[],
  startYPos: number
): Promise<number> {
  let currentYPos = startYPos;
  
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const blob = await response.blob();
        
        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function() {
            try {
              // Check if we need a new page
              if (currentYPos > 250) {
                doc.addPage();
                currentYPos = imageConstants.newPageYPosition;
              }
              
              const imgData = reader.result;
              if (imgData) {
                // Add image to PDF with fixed dimensions for services
                const imgWidth = 80;
                const imgHeight = 60;
                
                doc.addImage(
                  imgData as string,
                  'JPEG',
                  15,
                  currentYPos,
                  imgWidth,
                  imgHeight,
                  undefined,
                  'FAST'
                );
                
                // Add image label
                doc.setFontSize(fontSettings.defaultSize);
                doc.setFont(fontSettings.defaultFont, fontSettings.normalWeight);
                doc.text(`Service Image ${i + 1}`, 15, currentYPos + imgHeight + 8);
                
                currentYPos += imgHeight + imageConstants.imageSpacing;
              }
              resolve();
            } catch (error) {
              console.error(`Error adding service image ${i + 1}:`, error);
              resolve(); // Continue with next image
            }
          };
          
          reader.onerror = function() {
            console.error(`Error reading service image ${i + 1}`);
            resolve(); // Continue with next image
          };
          
          reader.readAsDataURL(blob);
        });
      } else {
        console.error(`Failed to fetch service image ${i + 1}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error loading service image ${i + 1}:`, error);
    }
  }
  
  return currentYPos;
}

/**
 * Processes multiple images sequentially for drawings/plans
 */
export async function processDrawingsImages(
  doc: jsPDF,
  images: string[],
  startYPos: number
): Promise<number> {
  let currentYPos = startYPos;
  
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    const caption = `Drawing/Plan ${i + 1}`;
    currentYPos = await processImage(doc, imageUrl, currentYPos, caption);
  }
  
  return currentYPos;
}
