import jsPDF from 'jspdf';
import type { PurchaseOrder, CompanySettings } from '../../../../types/database';
import type { PDFTheme, PDFDimensions, SummaryCalculations } from '../types';

/**
 * Formats order number to ensure proper format with company prefix
 */
export function formatOrderNumber(orderNumber: string, companyPrefix: string): string {
  // Check if the order number already contains a prefix-PO pattern
  const hasPOPrefix = /^[A-Za-z0-9]+-PO-\d+$/.test(orderNumber);
  return hasPOPrefix
    ? orderNumber 
    : `${companyPrefix}-PO-${orderNumber.padStart(5, '0')}`;
}

/**
 * Gets the default PDF theme colors and styles
 */
export function getPDFTheme(): PDFTheme {
  return {
    themeColor: '#000000',
    headerColor: '#edeaea',
    cellBackgroundColor: '#f7f7f7',
    supplierHeaderColor: '#edeaea',
    detailsHeaderColor: '#edeaea',
    itemsHeaderColor: '#edeaea',
    borderColor: [211, 211, 211] // Light gray border
  };
}

/**
 * Calculates PDF page dimensions and column positions
 */
export function getPDFDimensions(doc: jsPDF): PDFDimensions {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15; // Left margin
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

  return {
    pageWidth,
    leftColumnX,
    rightColumnX,
    boxWidth
  };
}

/**
 * Calculates subtotal, VAT, and total from purchase order items
 */
export function calculateOrderSummary(order: PurchaseOrder): SummaryCalculations {
  const subtotal = order.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const vat = order.amount - subtotal;
  const total = order.amount;

  return {
    subtotal,
    vat,
    total
  };
}

/**
 * Formats currency value for display
 */
export function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

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
    // Continue without logo - don't throw error
  }
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
      const footerWidth = doc.getTextWidth(footerText);
      const pageNumberWidth = doc.getTextWidth(pageNumberText);
      
      // Draw footer text on the left and page number on the right
      doc.text(footerText, 15, pageHeight - 10); // Left margin of 15px
      doc.text(pageNumberText, pageWidth - pageNumberWidth - 15, pageHeight - 10); // Right margin of 15px
    }
  }
}

/**
 * Sets PDF document properties and metadata
 */
export function setPDFProperties(doc: jsPDF, formattedOrderNumber: string, supplierName: string, companyName: string): void {
  doc.setProperties({
    title: `Purchase Order ${formattedOrderNumber}`,
    subject: `Purchase Order for ${supplierName}`,
    author: companyName,
    creator: 'OPG System'
  });
}
