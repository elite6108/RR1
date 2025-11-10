import type { CompanySettings } from '../../../../types/database';
import type { Section } from '../types';
import { pdfStyles, processOrganizationStructure } from '../utils';

// Function to create company information table
export function createCompanyInfoTable(
  doc: any,
  companySettings: CompanySettings,
  yPos: number
): void {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15;
  const rightColumnX = pageWidth / 2 + 5;
  const boxWidth = pageWidth / 2 - 20;

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{ content: 'COMPANY INFORMATION', styles: { fillColor: '#edeaea' } }],
    ],
    body: [
      [
        {
          content: [
            { text: companySettings.name, styles: { fontStyle: 'bold' } },
            { text: '\n' + companySettings.address_line1 },
            {
              text: companySettings.address_line2
                ? '\n' + companySettings.address_line2
                : '',
            },
            { text: `\n${companySettings.town}, ${companySettings.county}` },
            { text: '\n' + companySettings.post_code },
            { text: '\n\n' + companySettings.phone },
            { text: '\n' + companySettings.email },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: pdfStyles.greenColor,
      textColor: 'black',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: pdfStyles.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor,
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth,
  });
}

// Function to create policy details table
export function createPolicyDetailsTable(
  doc: any,
  title: string,
  policyNumber: number | undefined,
  yPos: number,
  createdAt?: string,
  updatedAt?: string
): void {
  const pageWidth = doc.internal.pageSize.width;
  const rightColumnX = pageWidth / 2 + 5;
  const boxWidth = pageWidth / 2 - 20;

  const createdDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  const updatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'POLICY DETAILS',
          colSpan: 2,
          styles: { fillColor: '#edeaea' },
        },
      ],
    ],
    body: [
      [
        { content: 'POLICY ID:', styles: { fontStyle: 'bold' } },
        `HSPOL-${String(policyNumber || '0').padStart(3, '0')}`,
      ],
      [{ content: 'TITLE:', styles: { fontStyle: 'bold' } }, title],
      [{ content: 'CREATED:', styles: { fontStyle: 'bold' } }, createdDate],
      [{ content: 'EDITED:', styles: { fontStyle: 'bold' } }, updatedDate],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: pdfStyles.greenColor,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: pdfStyles.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor,
    },
    columnStyles: {
      0: { cellWidth: boxWidth * 0.4 },
      1: { cellWidth: boxWidth * 0.6 },
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth,
  });
}

// Function to create content section table
export async function createContentSection(
  doc: any,
  section: Section,
  yPos: number
): Promise<number> {
  // Special handling for Organization Structure section
  if (section.header.toLowerCase().includes('organisation structure')) {
    const organizationContent = await processOrganizationStructure();
    section.content = organizationContent;
  }

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: section.header.toUpperCase(),
          styles: {
            fillColor: '#edeaea',
            textColor: '#000000',
            halign: 'left',
            fontStyle: 'bold',
            cellPadding: 3,
            fontSize: 10,
          },
        },
      ],
    ],
    body: [
      [
        {
          content: section.content,
          styles: {
            fillColor: pdfStyles.cellBackgroundColor,
            cellPadding: 5,
            lineHeight: 2,
            minCellHeight: 20,
            cellWidth: 'auto',
            halign: 'left',
            valign: 'top',
            fontSize: 10,
          },
        },
      ],
    ],
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor,
      overflow: 'linebreak',
    },
    theme: 'grid',
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

// Function to add PDF header
export function addPDFHeader(doc: any): void {
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(pdfStyles.themeColor);
  doc.text('HEALTH & SAFETY POLICY', 195, 25, { align: 'right' });

  // Reset text color
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}

// Function to add page numbers and footer
export function addPageFooter(
  doc: any,
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
      doc.setFontSize(9);
      doc.setTextColor(100);

      const footerText = footerParts.join('   ');
      const pageNumberText = `Page ${i} of ${pageCount}`;

      // Calculate positions
      const pageNumberWidth = doc.getTextWidth(pageNumberText);

      // Draw footer text on the left and page number on the right
      doc.text(footerText, 15, pageHeight - 10); // Left margin of 15px
      doc.text(
        pageNumberText,
        pageWidth - pageNumberWidth - 15,
        pageHeight - 10
      ); // Right margin of 15px
    }
  }
}

// Function to initialize PDF document
export function initializePDF(jsPDFInstance: any): any {
  // Set default font
  jsPDFInstance.setFont('helvetica');

  return jsPDFInstance;
}
