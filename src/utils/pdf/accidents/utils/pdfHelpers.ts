import jsPDF from 'jspdf';
import { CompanySettings, ActionItem, FormField } from '../types';

// PDF theme colors and styles
export const PDF_THEME = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  borderColor: [211, 211, 211] as [number, number, number], // Light gray border
};

/**
 * Adds company logo to PDF document
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

/**
 * Adds company information table to PDF
 */
export function addCompanyInfoTable(doc: jsPDF, companySettings: CompanySettings, yPos: number): void {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15; // Left margin
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

  (doc as any).autoTable({
    startY: yPos,
    head: [['COMPANY INFORMATION']],
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
      fillColor: PDF_THEME.headerColor,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: PDF_THEME.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: PDF_THEME.borderColor
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth
  });
}

/**
 * Adds report details table to PDF
 */
export function addReportDetailsTable(doc: jsPDF, reportData: any, createdByName: string, yPos: number): void {
  const pageWidth = doc.internal.pageSize.width;
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'REPORT DETAILS', colSpan: 2 }]],
    body: [
      [{ content: 'REPORT ID:', styles: { fontStyle: 'bold' } }, reportData.auto_id || reportData.autoId || 'N/A'],
      [{ content: 'REPORT TYPE:', styles: { fontStyle: 'bold' } }, reportData.report_type || reportData.reportType || 'N/A'],
      [{ content: 'CATEGORY:', styles: { fontStyle: 'bold' } }, reportData.category || 'N/A'],
      [{ content: 'CREATED:', styles: { fontStyle: 'bold' } }, new Date(reportData.created_at || Date.now()).toLocaleDateString()],
      [{ content: 'CREATED BY:', styles: { fontStyle: 'bold' } }, createdByName]
    ],
    theme: 'grid',
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
    columnStyles: { 
      0: { cellWidth: boxWidth * 0.4 },
      1: { cellWidth: boxWidth * 0.6 }
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth
  });
}

/**
 * Formats field value based on field type
 */
export function formatFieldValue(value: any, fieldType: string): string {
  // Skip fields that are empty or null
  if (value === null || value === undefined || value === '' || 
      (Array.isArray(value) && value.length === 0)) {
    return '';
  }

  switch (fieldType) {
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'date':
      return value ? new Date(value).toLocaleDateString() : 'N/A';
    case 'datetime':
      return value ? new Date(value).toLocaleString() : 'N/A';
    case 'array':
      return Array.isArray(value) ? value.join(', ') : (value || 'N/A');
    case 'actions':
      if (Array.isArray(value) && value.length > 0) {
        return value.map((action: ActionItem, index: number) => 
          `${index + 1}. ${action.title} (Due: ${action.dueDate || 'N/A'})\n   ${action.description || ''}`
        ).join('\n\n');
      } else {
        return 'No actions recorded';
      }
    case 'textarea':
    case 'text':
    default:
      return String(value || 'N/A');
  }
}

/**
 * Creates section rows for a form section
 */
export function createSectionRows(fields: FormField[], reportData: any): any[] {
  const sectionRows: any[] = [];
  
  for (const field of fields) {
    const value = reportData[field.key];
    const displayValue = formatFieldValue(value, field.type);
    
    // Skip empty fields
    if (displayValue === '') {
      continue;
    }

    sectionRows.push([
      { content: field.label.toUpperCase() + ':', styles: { fontStyle: 'bold' } },
      displayValue
    ]);
  }

  return sectionRows;
}

/**
 * Adds a section table to PDF
 */
export function addSectionTable(doc: jsPDF, sectionTitle: string, sectionRows: any[], yPos: number): number {
  if (sectionRows.length === 0) {
    return yPos;
  }

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: sectionTitle, colSpan: 2 }]],
    body: sectionRows,
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
    columnStyles: { 
      0: { cellWidth: 60 },
      1: { cellWidth: 'auto' }
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Adds footer with page numbers and company details
 */
export function addFooter(doc: jsPDF, companySettings: CompanySettings): void {
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
