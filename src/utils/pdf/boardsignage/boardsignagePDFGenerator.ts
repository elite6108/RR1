import jsPDF from 'jspdf';
import { supabase } from '../../../lib/supabase';

interface BoardData {
  id: string;
  title: string;
  size: string;
  orientation: string;
  status: string;
  site: string;
  site_name: string;
  signs: Array<{ artworkId: string; code: string }>;
  text: Record<string, { useDefaultText: boolean; customText?: string }>;
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Convert mm to points (1mm = 2.834645669 points)
const mmToPoints = (mm: number) => mm * 2.834645669;

// Parse size string to get dimensions in mm
const parseSizeString = (sizeString: string): { width: number; height: number } => {
  // Handle different formats: "300 x 200 mm", "900mm x 1200mm"
  const cleanSize = sizeString.replace(/mm/g, '').replace(/\s+/g, '');
  const parts = cleanSize.split('x');
  
  if (parts.length === 2) {
    const width = parseInt(parts[0]);
    const height = parseInt(parts[1]);
    return { width, height };
  }
  
  // Default fallback
  return { width: 300, height: 200 };
};

// Get PDF format based on orientation and size
const getPDFFormat = (size: string, orientation: string): [number, number] => {
  const { width, height } = parseSizeString(size);
  
  if (orientation.toLowerCase() === 'landscape') {
    return [mmToPoints(Math.max(width, height)), mmToPoints(Math.min(width, height))];
  } else {
    return [mmToPoints(Math.min(width, height)), mmToPoints(Math.max(width, height))];
  }
};

// Generate signed URL for image
const generateSignedUrl = async (fileName: string): Promise<string> => {
  try {
    const { data } = await supabase.storage
      .from('signage-artwork')
      .createSignedUrl(fileName, 3600); // 1 hour expiry
    
    return data?.signedUrl || '';
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return '';
  }
};

// Load image and convert to base64 for PDF (preserve SVG format)
const loadImageAsBase64 = async (signedUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Fill with white background for transparency
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the image
        ctx.drawImage(img, 0, 0);
        
        // Convert to base64 (use PNG for better SVG support)
        const base64 = canvas.toDataURL('image/png', 1.0);
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = signedUrl;
  });
};

// Get artwork files and metadata
const getArtworkData = async () => {
  try {
    // Get files from storage
    const { data: files, error: filesError } = await supabase.storage
      .from('signage-artwork')
      .list('', { limit: 100 });

    if (filesError) throw filesError;

    // Get metadata from database
    const { data: metadata, error: metadataError } = await supabase
      .from('signage_artwork')
      .select('file_name, display_name, category');

    if (metadataError) throw metadataError;

    // Create metadata map
    const metadataMap = new Map();
    if (metadata) {
      metadata.forEach((item: any) => {
        metadataMap.set(item.file_name, item);
      });
    }

    // Combine files with metadata and generate signed URLs
    const artworkData = new Map();
    if (files) {
      for (const file of files) {
        const meta = metadataMap.get(file.name);
        const displayName = meta?.display_name || file.name;
        
        // Extract code from display name (e.g., "E001 - Emergency Exit" -> "E001")
        const codeMatch = displayName.match(/^([A-Z]\d{3})/);
        const code = codeMatch ? codeMatch[1] : file.name.replace(/\.[^/.]+$/, "");
        
        // Generate signed URL
        const signedUrl = await generateSignedUrl(file.name);
        
        artworkData.set(code, {
          fileName: file.name,
          displayName: displayName,
          category: meta?.category || 'unknown',
          code: code,
          signedUrl: signedUrl
        });
      }
    }

    return artworkData;
  } catch (error) {
    console.error('Error getting artwork data:', error);
    return new Map();
  }
};

// Get company settings for footer
const getCompanySettings = async () => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('name, phone, email, logo_url')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return null;
  }
};

// Load company logo as base64
const loadCompanyLogo = async (logoUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null); // Return null on error instead of rejecting
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading company logo:', error);
    return null;
  }
};

// Load specific signage icon by filename
const loadSignageIcon = async (fileName: string): Promise<string | null> => {
  try {
    const signedUrl = await generateSignedUrl(fileName);
    if (signedUrl) {
      return await loadImageAsBase64(signedUrl);
    }
    return null;
  } catch (error) {
    console.error(`Error loading signage icon ${fileName}:`, error);
    return null;
  }
};

// Function to draw rounded rectangle using basic jsPDF methods
const drawRoundedRect = (pdf: any, x: number, y: number, width: number, height: number, radius: number, fillColor?: [number, number, number]) => {
  if (fillColor) {
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
  }
  
  // Draw main rectangle
  pdf.rect(x + radius, y, width - 2 * radius, height, fillColor ? 'F' : 'S');
  pdf.rect(x, y + radius, width, height - 2 * radius, fillColor ? 'F' : 'S');
  
  // Draw corner circles to create rounded effect
  if (fillColor) {
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    // Top-left corner
    pdf.circle(x + radius, y + radius, radius, 'F');
    // Top-right corner  
    pdf.circle(x + width - radius, y + radius, radius, 'F');
    // Bottom-left corner
    pdf.circle(x + radius, y + height - radius, radius, 'F');
    // Bottom-right corner
    pdf.circle(x + width - radius, y + height - radius, radius, 'F');
  }
};

export const generateBoardSignagePDF = async (board: BoardData) => {
  try {
    // Get PDF dimensions
    const [pdfWidth, pdfHeight] = getPDFFormat(board.size, board.orientation);
    
    // Create PDF with custom dimensions
    const pdf = new jsPDF({
      orientation: board.orientation.toLowerCase() === 'landscape' ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [pdfWidth, pdfHeight]
    });

    // Define page margins
    const pageMargin = 15;
    const contentWidth = pdfWidth - (pageMargin * 2);
    const contentHeight = pdfHeight - (pageMargin * 2);

    // SECTION 1: HEADER (with margin and rounded corners)
    const headerHeight = 70;
    const cornerRadius = 4; // Reduced radius for more subtle rounding
    
    // Draw rounded header background
    drawRoundedRect(pdf, pageMargin, pageMargin, contentWidth, headerHeight, cornerRadius, [15, 146, 70]);

    // Properly center "SITE SAFETY" text vertically
    pdf.setFontSize(48);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255); // White text
    let headerTextY = pageMargin + headerHeight / 1.7 + 12;
    pdf.text('SITE SAFETY', pdfWidth / 2, headerTextY, { align: 'center' });
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);

    let currentY = pageMargin + headerHeight + 20;

    // SECTIONS 2 & 3: WARNING AND VISITORS (SIDE BY SIDE with margins and rounded corners)
    const sectionHeight = 75; // Slightly increased height for larger icons
    const sectionWidth = (contentWidth - 15) / 2; // Reduced gap between sections (15pt instead of 20pt)
    const sectionSpacing = 15; // Reduced spacing

    // WARNING SECTION (LEFT SIDE)
    const warningX = pageMargin;
    const warningIconWidth = sectionWidth * 0.35; // Increased to 35% for larger icons
    const warningTextWidth = sectionWidth * 0.65; // Reduced to 65% for text

    // Warning section background with rounded corners (yellow)
    drawRoundedRect(pdf, warningX + warningIconWidth, currentY, warningTextWidth, sectionHeight, cornerRadius, [255, 229, 2]);

    // Load and add warning icon (35% of left section - larger)
    const warningIcon = await loadSignageIcon('1748521659554-w001-general-warning-sign.svg');
    if (warningIcon) {
      const iconSize = Math.min(warningIconWidth - 8, sectionHeight - 8); // Larger icon with minimal padding
      const iconX = warningX + (warningIconWidth - iconSize) / 2;
      const iconY = currentY + (sectionHeight - iconSize) / 2;
      pdf.addImage(warningIcon, 'PNG', iconX, iconY, iconSize, iconSize);
    }

    // Warning text (65% of left section) - with equal padding
    const warningTextPadding = 12; // Equal padding on left and right
    pdf.setFontSize(25); // Increased font size
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0); // Black text
    let warningTextY = currentY + 35;
    pdf.text('Warning', warningX + warningIconWidth + warningTextPadding, warningTextY);
    
    pdf.setFontSize(20); // Increased font size for construction site text
    pdf.setFont('helvetica', 'normal');
    let constructionTextY = currentY + 60;
    pdf.text('Construction site', warningX + warningIconWidth + warningTextPadding, constructionTextY);

    // VISITORS SECTION (RIGHT SIDE)
    const visitorsX = pageMargin + sectionWidth + sectionSpacing;
    const visitorsIconWidth = sectionWidth * 0.35; // Increased to 35% for larger icons
    const visitorsTextWidth = sectionWidth * 0.65; // Reduced to 65% for text

    // Visitors section background with rounded corners (blue)
    drawRoundedRect(pdf, visitorsX + visitorsIconWidth, currentY, visitorsTextWidth, sectionHeight, cornerRadius, [54, 102, 176]);

    // Load and add mandatory icon (35% of right section - larger)
    const mandatoryIcon = await loadSignageIcon('1741185760878-m001-general-mandatory-action-sign.svg');
    if (mandatoryIcon) {
      const iconSize = Math.min(visitorsIconWidth - 8, sectionHeight - 8); // Larger icon with minimal padding
      const iconX = visitorsX + (visitorsIconWidth - iconSize) / 2;
      const iconY = currentY + (sectionHeight - iconSize) / 2;
      pdf.addImage(mandatoryIcon, 'PNG', iconX, iconY, iconSize, iconSize);
    }

    // Visitors text (65% of right section) - with equal padding
    const visitorsTextPadding = 20; // Increased padding for more breathing room
    pdf.setFontSize(board.orientation.toLowerCase() === 'portrait' ? 18 : 22); // Reduced font size for portrait
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255); // White text
    const visitorsText = pdf.splitTextToSize('All visitors to report to site office', visitorsTextWidth - (visitorsTextPadding * 2));
    let textY = currentY + 30 + (visitorsText.length > 1 ? 0 : 8); // Start from top of box with padding
    visitorsText.forEach((line: string) => {
      pdf.text(line, visitorsX + visitorsIconWidth + visitorsTextPadding, textY);
      textY += 24; // Increased line height to match font size
    });

    currentY += sectionHeight + (board.orientation.toLowerCase() === 'portrait' ? 20 : 30);

    // SECTION 4: SAFETY SIGNS (with margins)
    // Get artwork data and company settings
    console.log('Fetching artwork data and company settings...');
    const [artworkData, companySettings] = await Promise.all([
      getArtworkData(),
      getCompanySettings()
    ]);
    console.log('Artwork data fetched:', artworkData.size, 'items');
    console.log('Company settings:', companySettings);

    const imageSize = Math.min(120, (contentWidth - 60) / 4); // Responsive image size within content area
    const spacing = 15;
    const imagesPerRow = Math.floor((contentWidth - 40) / (imageSize + spacing));
    let currentRow = 0;
    let currentCol = 0;

    // Process each sign
    for (let i = 0; i < board.signs.length; i++) {
      const sign = board.signs[i];
      const artwork = artworkData.get(sign.code);
      
      if (!artwork) {
        console.warn(`Artwork not found for code: ${sign.code}`);
        continue;
      }

      console.log(`Processing sign ${sign.code}...`);

      try {
        // Calculate position (with page margins)
        const xPosition = pageMargin + 20 + currentCol * (imageSize + spacing);
        const imageYPosition = currentY + currentRow * (imageSize + 100);

        if (artwork.signedUrl) {
          // Load and add image (keep as PNG for SVG compatibility)
          console.log(`Loading image for ${sign.code}...`);
          const imageData = await loadImageAsBase64(artwork.signedUrl);
          
          // Add white background for the image
          pdf.setFillColor(255, 255, 255);
          pdf.rect(xPosition, imageYPosition, imageSize, imageSize, 'F');
          
          // Add border
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(1);
          pdf.rect(xPosition, imageYPosition, imageSize, imageSize);
          
          // Add the image as PNG (better SVG support)
          pdf.addImage(imageData, 'PNG', xPosition + 2, imageYPosition + 2, imageSize - 4, imageSize - 4);
          
          console.log(`Image added for ${sign.code}`);
        } else {
          // Add placeholder for missing signed URL
          pdf.setFillColor(240, 240, 240);
          pdf.rect(xPosition, imageYPosition, imageSize, imageSize, 'F');
          pdf.setDrawColor(200, 200, 200);
          pdf.rect(xPosition, imageYPosition, imageSize, imageSize);
          
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text('No Image', xPosition + imageSize/2, imageYPosition + imageSize/2, { align: 'center' });
        }

        // Add sign code below image
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(sign.code, xPosition + imageSize/2, imageYPosition + imageSize + 15, { align: 'center' });

        // Add text from board.text column
        const textConfig = board.text[sign.artworkId] || board.text[sign.code];
        if (textConfig) {
          let displayText = '';
          
          if (textConfig.useDefaultText) {
            // Use default text from artwork display name
            const defaultText = artwork.displayName.replace(/^[A-Z]\d{3}\s*-\s*/, '');
            displayText = defaultText;
          } else if (textConfig.customText) {
            // Use custom text
            displayText = textConfig.customText;
          }

          if (displayText) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            // Split text into multiple lines if needed
            const lines = pdf.splitTextToSize(displayText, imageSize);
            let textY = imageYPosition + imageSize + 30;
            
            lines.slice(0, 3).forEach((line: string) => { // Limit to 3 lines
              pdf.text(line, xPosition + imageSize/2, textY, { align: 'center' });
              textY += 12;
            });
          }
        }

        currentCol++;
        if (currentCol >= imagesPerRow) {
          currentCol = 0;
          currentRow++;
        }

      } catch (imageError) {
        console.error(`Error loading image for sign ${sign.code}:`, imageError);
        
        // Add placeholder for failed images (with page margins)
        const xPosition = pageMargin + 20 + currentCol * (imageSize + spacing);
        const imageYPosition = currentY + currentRow * (imageSize + 100);
        
        pdf.setFillColor(255, 240, 240);
        pdf.rect(xPosition, imageYPosition, imageSize, imageSize, 'F');
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(xPosition, imageYPosition, imageSize, imageSize);
        
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Image', xPosition + imageSize/2, imageYPosition + imageSize/2 - 5, { align: 'center' });
        pdf.text('Error', xPosition + imageSize/2, imageYPosition + imageSize/2 + 5, { align: 'center' });
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(sign.code, xPosition + imageSize/2, imageYPosition + imageSize + 15, { align: 'center' });

        currentCol++;
        if (currentCol >= imagesPerRow) {
          currentCol = 0;
          currentRow++;
        }
      }
    }

    // FOOTER SECTION (with margins)
    const footerY = pdfHeight - pageMargin - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    
    // Left side - Company logo (proportional, PNG format for better quality)
    if (companySettings?.logo_url) {
      try {
        const logoData = await loadCompanyLogo(companySettings.logo_url);
        if (logoData) {
          // Create a temporary image to get dimensions for proportional scaling
          const tempImg = new Image();
          tempImg.onload = () => {
            const maxWidth = 40;
            const maxHeight = 25;
            const aspectRatio = tempImg.width / tempImg.height;
            
            let logoWidth = maxWidth;
            let logoHeight = maxWidth / aspectRatio;
            
            // If height exceeds max, scale by height instead
            if (logoHeight > maxHeight) {
              logoHeight = maxHeight;
              logoWidth = maxHeight * aspectRatio;
            }
            
            // Add logo to left side of footer with proportional dimensions (PNG format)
            pdf.addImage(logoData, 'PNG', pageMargin, footerY - logoHeight, logoWidth, logoHeight);
          };
          tempImg.src = logoData;
          
          // Fallback: Add logo with default proportional size if image loading fails
          setTimeout(() => {
            if (!tempImg.complete) {
              pdf.addImage(logoData, 'PNG', pageMargin, footerY - 20, 30, 20);
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error adding company logo:', error);
      }
    }
    
    // Left side - Generation date (next to logo, with margin)
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageMargin + 50, footerY);
    
    // Right side - Company name and phone (with margin)
    if (companySettings) {
      const contactInfo = [];
      if (companySettings.name) contactInfo.push(companySettings.name);
      if (companySettings.phone) contactInfo.push(`Tel: ${companySettings.phone}`);
      
      if (contactInfo.length > 0) {
        pdf.text(contactInfo.join(' | '), pdfWidth - pageMargin, footerY, { align: 'right' });
      }
    }

    // Save the PDF
    const fileName = `board-signage-${board.site_name.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    pdf.save(fileName);

    console.log('PDF generated successfully:', fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
