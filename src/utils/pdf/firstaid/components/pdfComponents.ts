import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CompanySettings } from '../../../../types/database';
import type { PDFTheme, PDFDimensions, FirstAidSection, ProcessedFirstAidData } from '../types';

/**
 * Gets the default PDF theme configuration
 */
export function getPDFTheme(): PDFTheme {
  return {
    themeColor: '#000000',
    headerColor: '#edeaea',
    cellBackgroundColor: '#f7f7f7',
    borderColor: [211, 211, 211] as [number, number, number] // Light gray border
  };
}

/**
 * Calculates PDF dimensions and positioning
 */
export function getPDFDimensions(doc: jsPDF): PDFDimensions {
  const pageWidth = doc.internal.pageSize.width;
  return {
    pageWidth,
    leftColumnX: 15, // Left margin
    rightColumnX: pageWidth / 2 + 5, // Adjusted for proper spacing
    boxWidth: pageWidth / 2 - 20 // Box width for equal spacing
  };
}

/**
 * Adds company logo to the PDF document
 */
export async function addCompanyLogo(doc: jsPDF, logoUrl: string): Promise<void> {
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
    // Continue without logo - don't throw to prevent breaking PDF generation
  }
}

/**
 * Adds the assessment header with assessment ID
 */
export function addAssessmentHeader(doc: jsPDF, assessmentId: string, theme: PDFTheme): void {
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.themeColor);
  doc.text(assessmentId, 195, 25, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}

/**
 * Creates the company information table
 */
export function createCompanyInfoTable(
  doc: jsPDF, 
  companySettings: CompanySettings, 
  dimensions: PDFDimensions, 
  theme: PDFTheme, 
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['Business Details']],
    body: [
      [{
        content: [
          { text: companySettings.name, styles: { fontStyle: 'bold' } },
          { text: '\n' + companySettings.address_line1 },
          { text: companySettings.address_line2 ? '\n' + companySettings.address_line2 : '' },
          { text: `\n${companySettings.town}, ${companySettings.county}` },
          { text: '\n' + companySettings.post_code },
          { text: '\n\n'+ companySettings.phone },
          { text: '\n' + companySettings.email }
        ].map(item => item.text).join(''),
        styles: { cellWidth: 'auto', halign: 'left' }
      }]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: theme.headerColor,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: theme.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: theme.borderColor
    },
    margin: { left: dimensions.leftColumnX, right: dimensions.rightColumnX },
    tableWidth: dimensions.boxWidth
  });
}

/**
 * Creates the assessment details table
 */
export function createAssessmentDetailsTable(
  doc: jsPDF, 
  assessmentData: ProcessedFirstAidData, 
  dimensions: PDFDimensions, 
  theme: PDFTheme, 
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'FIRST AID NEEDS ASSESSMENT DETAILS', colSpan: 2 }]],
    body: [
      [{ content: 'TITLE:', styles: { fontStyle: 'bold' } }, assessmentData.basicInfo.assessmentTitle],
      [{ content: 'ID:', styles: { fontStyle: 'bold' } }, assessmentData.basicInfo.assessmentId],
      [{ content: 'DATE:', styles: { fontStyle: 'bold' } }, assessmentData.basicInfo.assessmentDate],
      [{ content: 'ASSESSOR:', styles: { fontStyle: 'bold' } }, assessmentData.basicInfo.assessorName],
      [{ content: 'NEXT REVIEW:', styles: { fontStyle: 'bold' } }, assessmentData.basicInfo.reviewDate]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: theme.headerColor,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: theme.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: theme.borderColor
    },
    margin: { left: dimensions.rightColumnX, right: 15 },
    tableWidth: dimensions.boxWidth,
    columnStyles: {
      0: { cellWidth: dimensions.boxWidth * 0.4 },
      1: { cellWidth: dimensions.boxWidth * 0.6 }
    },
  });
}

/**
 * Creates a two-column table for section data
 */
export function createTwoColumnTable(
  doc: jsPDF,
  section: FirstAidSection,
  theme: PDFTheme,
  yPos: number
): number {
  // Parse the section content into question-answer pairs
  const rows = parseContentIntoRows(section.content, doc);

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ 
      content: section.title,
      colSpan: 2,
      styles: { 
        fillColor: theme.headerColor,
        textColor: '#000000',
        halign: 'left',
        fontStyle: 'bold',
        cellPadding: 3,
        fontSize: 12
      }
    }]],
    body: rows,
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
      overflow: 'linebreak',
      cellPadding: 3
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Creates a single-column table for section data
 */
export function createSingleColumnTable(
  doc: jsPDF,
  section: FirstAidSection,
  theme: PDFTheme,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ 
      content: section.title,
      styles: { 
        fillColor: theme.headerColor,
        textColor: '#000000',
        halign: 'left',
        fontStyle: 'bold',
        cellPadding: 3,
        fontSize: 12
      }
    }]],
    body: [[{ 
      content: section.content,
      styles: { 
        fillColor: theme.cellBackgroundColor,
        cellPadding: 3,
        lineHeight: 1.5,
        cellWidth: 'auto',
        halign: 'left',
        valign: 'top',
        fontSize: 10
      }
    }]],
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
      overflow: 'linebreak'
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Helper function to parse section content into question-answer rows
 */
function parseContentIntoRows(content: string | string[], doc: jsPDF): any[][] {
  const contentStr = Array.isArray(content) ? content.join('\n\n') : content;
  const pageWidth = doc.internal.pageSize.width;
  const cellWidth = (pageWidth - 30) / 2; // PDF width minus margins, divided by 2
  
  // Split content by double newlines to get question-answer pairs
  const pairs = contentStr.split('\n\n').filter(pair => pair.trim());
  
  return pairs.map(pair => {
    // Split each pair by the first colon or by newline
    const colonIndex = pair.indexOf(':');
    if (colonIndex !== -1) {
      const question = pair.substring(0, colonIndex + 1).trim();
      const answer = pair.substring(colonIndex + 1).trim();
      
      return [
        { 
          content: question,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: cellWidth,
            cellPadding: 3
          }
        },
        {
          content: answer,
          styles: {
            fillColor: '#ffffff',
            cellWidth: cellWidth,
            cellPadding: 3
          }
        }
      ];
    }
    
    // If no colon found, treat as single content spanning both columns
    return [{ 
      content: pair,
      colSpan: 2,
      styles: {
        fillColor: '#ffffff',
        cellPadding: 3
      }
    }];
  });
}

/**
 * Adds assessment sections to the PDF using 2-column layout
 */
export function addAssessmentSections(doc: jsPDF, sections: FirstAidSection[], theme: PDFTheme, startY: number): void {
  let yPos = startY;
  
  sections.forEach((section) => {
    // Use 2-column layout for all sections
    yPos = createTwoColumnTable(doc, section, theme, yPos);
  });
}

/**
 * Adds page numbers and footer information to all pages
 */
export function addPageFooters(doc: jsPDF, companySettings: CompanySettings): void {
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
      const pageNumberWidth = doc.getTextWidth(pageNumberText);
      
      // Draw footer text on the left and page number on the right
      doc.text(footerText, 15, pageHeight - 10); // Left margin of 15px
      doc.text(pageNumberText, pageWidth - pageNumberWidth - 15, pageHeight - 10); // Right margin of 15px
    }
  }
}