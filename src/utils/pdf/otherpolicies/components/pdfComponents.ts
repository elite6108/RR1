import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CompanySettings } from '../../../../types/database';
import type { PDFTheme, PDFDimensions, PolicySection } from '../types';
import { htmlToFormattedText } from '../utils/htmlProcessor';

/**
 * Gets the default PDF theme configuration
 */
export function getPDFTheme(): PDFTheme {
  return {
    themeColor: '#000000',
    headerColor: '#edeaea',
    cellBackgroundColor: '#f7f7f7',
    borderColor: [211, 211, 211] as [number, number, number], // Light gray border
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
    boxWidth: pageWidth / 2 - 20, // Box width for equal spacing
  };
}

/**
 * Adds company logo to the PDF document
 */
export async function addCompanyLogo(
  doc: jsPDF,
  logoUrl: string
): Promise<void> {
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
            const aspectRatio = 300 / 91; // Default aspect ratio
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
          reject(
            new Error(
              `Failed to add logo to PDF: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
          );
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
 * Adds the policy header with policy number
 */
export function addPolicyHeader(
  doc: jsPDF,
  policyNumber: number,
  theme: PDFTheme
): void {
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.themeColor);
  doc.text(`POL-${String(policyNumber).padStart(3, '0')}`, 195, 25, {
    align: 'right',
  });

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
    head: [['COMPANY INFORMATION']],
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
      fillColor: theme.headerColor,
      textColor: 'black',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: theme.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: dimensions.leftColumnX, right: dimensions.rightColumnX },
    tableWidth: dimensions.boxWidth,
  });
}

/**
 * Creates the policy details table
 */
export function createPolicyDetailsTable(
  doc: jsPDF,
  title: string,
  policyNumber: number,
  dimensions: PDFDimensions,
  theme: PDFTheme,
  yPos: number,
  createdAt?: string,
  updatedAt?: string
): void {
  const createdDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  const updatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'POLICY DETAILS', colSpan: 2 }]],
    body: [
      [{ content: 'POLICY NAME:', styles: { fontStyle: 'bold' } }, title],
      [
        { content: 'CREATED DATE:', styles: { fontStyle: 'bold' } },
        createdDate,
      ],
      [{ content: 'LAST EDITED:', styles: { fontStyle: 'bold' } }, updatedDate],
      [
        { content: 'POLICY ID:', styles: { fontStyle: 'bold' } },
        `POL-${String(policyNumber).padStart(3, '0')}`,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: theme.headerColor,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3, // Updated to match Company Information table
      fillColor: theme.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: dimensions.rightColumnX, right: 15 },
    tableWidth: dimensions.boxWidth,
    columnStyles: {
      0: { cellWidth: dimensions.boxWidth * 0.4 },
      1: { cellWidth: dimensions.boxWidth * 0.6 },
    },
  });
}

/**
 * Adds policy sections to the PDF
 */
export function addPolicySections(
  doc: jsPDF,
  sections: PolicySection[],
  theme: PDFTheme,
  startY: number
): void {
  let yPos = startY;

  sections.forEach((section, index) => {
    // Add section header
    (doc as any).autoTable({
      startY: yPos,
      head: [[section.title]],
      body: [],
      theme: 'grid',
      headStyles: {
        fillColor: theme.headerColor,
        textColor: 'black',
        fontStyle: 'bold',
        fontSize: 12,
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: theme.borderColor,
      },
      margin: { left: 15, right: 15 },
    });

    // Add section content
    yPos = (doc as any).lastAutoTable.finalY;
    (doc as any).autoTable({
      startY: yPos,
      body: [
        [
          {
            content: htmlToFormattedText(section.content),
            styles: { fillColor: theme.cellBackgroundColor },
          },
        ],
      ],
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: theme.borderColor,
      },
      theme: 'plain',
      margin: { left: 15, right: 15 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 5; // Add small gap between sections
  });
}

/**
 * Adds page numbers and footer information to all pages
 */
export function addPageFooters(
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
      doc.setFontSize(9);
      doc.setTextColor(100);

      const footerText = footerParts.join('   ');
      const pageNumberText = `Page ${i} of ${pageCount}`;

      // Calculate positions
      const footerWidth = doc.getTextWidth(footerText);
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
