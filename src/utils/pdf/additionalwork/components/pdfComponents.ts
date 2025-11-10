import jsPDF from 'jspdf';
import type { CompanySettings } from '../../../../types/database';
import type { AdditionalWork, PageLayout } from '../types';
import { PDF_THEME, FONT_SIZES, TABLE_STYLES, PAGE_LAYOUT } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

/**
 * Adds the document title to the PDF
 */
export function addDocumentTitle(doc: jsPDF): void {
  doc.setFontSize(FONT_SIZES.title);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PDF_THEME.themeColor);
  doc.text('ADDITIONAL WORK', PAGE_LAYOUT.titlePosition.x, PAGE_LAYOUT.titlePosition.y, { align: 'right' });
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(FONT_SIZES.normal);
  doc.setFont('helvetica', 'normal');
}

/**
 * Creates the company information table
 */
export function addCompanyInformation(
  doc: jsPDF,
  companySettings: CompanySettings,
  layout: PageLayout,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'COMPANY INFORMATION', styles: { fillColor: PDF_THEME.detailsHeaderColor } }]],
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
      fontSize: TABLE_STYLES.fontSize,
      cellPadding: TABLE_STYLES.cellPadding,
      fillColor: PDF_THEME.cellBackgroundColor,
      lineWidth: TABLE_STYLES.lineWidth,
      lineColor: PDF_THEME.borderColor
    },
    margin: { left: layout.leftColumnX, right: layout.rightColumnX },
    tableWidth: layout.boxWidth
  });
}

/**
 * Creates the additional work details table
 */
export function addAdditionalWorkDetails(
  doc: jsPDF,
  additionalWork: AdditionalWork,
  projectName: string,
  layout: PageLayout,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'ADDITIONAL WORK DETAILS', colSpan: 2, styles: { fillColor: PDF_THEME.detailsHeaderColor } }]],
    body: [
      [{ content: 'PROJECT:', styles: { fontStyle: 'bold' } }, projectName],
      [{ content: 'DATE:', styles: { fontStyle: 'bold' } }, new Date(additionalWork.created_at).toLocaleDateString()],
      [{ content: 'TITLE:', styles: { fontStyle: 'bold' } }, additionalWork.title],
      [{ content: 'AGREED:', styles: { fontStyle: 'bold' } }, additionalWork.agreed_with],
      [{ content: 'AMOUNT:', styles: { fontStyle: 'bold' } }, formatCurrency(additionalWork.agreed_amount, additionalWork.vat_type)]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: PDF_THEME.headerColor,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: TABLE_STYLES.fontSize,
      cellPadding: TABLE_STYLES.cellPadding,
      fillColor: PDF_THEME.cellBackgroundColor,
      lineWidth: TABLE_STYLES.lineWidth,
      lineColor: PDF_THEME.borderColor
    },
    columnStyles: { 
      0: { cellWidth: layout.boxWidth * 0.4 },
      1: { cellWidth: layout.boxWidth * 0.6 }
    },
    margin: { left: layout.rightColumnX, right: 15 },
    tableWidth: layout.boxWidth
  });
}

/**
 * Creates the work description section
 */
export function addWorkDescription(
  doc: jsPDF,
  additionalWork: AdditionalWork,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['DESCRIPTION OF WORK']],
    body: [[additionalWork.description]],
    headStyles: {
      fillColor: PDF_THEME.headerColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    bodyStyles: {
      fillColor: PDF_THEME.cellBackgroundColor
    },
    styles: {
      fontSize: TABLE_STYLES.fontSize,
      cellPadding: TABLE_STYLES.cellPadding,
      lineWidth: TABLE_STYLES.lineWidth,
      lineColor: PDF_THEME.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });
}

/**
 * Creates the signature section
 */
export function addSignatureSection(
  doc: jsPDF,
  additionalWork: AdditionalWork,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['SIGNATURES']],
    body: [[
      {
        content: `
I hereby agree to the additional work detailed above for the amount of ${formatCurrency(additionalWork.agreed_amount, additionalWork.vat_type)}.


To be signed by: ${additionalWork.agreed_with}

Print Name: ____________________________

Signature: ______________________________     

Date: _________________________________


        `,
        styles: { cellPadding: TABLE_STYLES.signatureCellPadding }
      }
    ]],
    headStyles: {
      fillColor: PDF_THEME.headerColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    bodyStyles: {
      fillColor: PDF_THEME.cellBackgroundColor,
      minCellHeight: TABLE_STYLES.signatureMinHeight
    },
    styles: {
      fontSize: TABLE_STYLES.fontSize,
      lineWidth: TABLE_STYLES.lineWidth,
      cellPadding: TABLE_STYLES.cellPadding,
      lineColor: PDF_THEME.borderColor,
      halign: 'left'
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });
}

/**
 * Adds page numbers and footer to all pages
 */
export function addFooterAndPageNumbers(
  doc: jsPDF,
  companySettings: CompanySettings
): void {
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
      doc.setFontSize(FONT_SIZES.footer);
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
