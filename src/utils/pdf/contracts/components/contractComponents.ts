/*
 * PDF components for contract PDF generation - table and layout functions
 */

import jsPDF from 'jspdf';
import { PDFStyles } from '../../../../styles/pdffont';
import {
  CompanySettings,
  CustomerData,
  ProjectData,
  SiteData,
  Contract,
  PDFTableOptions,
} from '../types';
import { addSectionHeader, addSectionContent, checkNewPage } from '../utils/pdfHelpers';

const pageMargin = PDFStyles.spacing.pageMargin;

/**
 * Add PDF title
 */
export function addPDFTitle(doc: jsPDF, contract: Contract, themeColor: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(PDFStyles.font.sizes.title);
  doc.setFont(PDFStyles.font.family, PDFStyles.font.weights.bold);
  doc.setTextColor(themeColor);
  doc.text(`JCT CONTRACT | ID: ${contract.contract_id || 'N/A'}`, pageWidth - pageMargin, pageMargin + 10, {
    align: 'right',
  });

  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(PDFStyles.font.sizes.body);
  doc.setFont(PDFStyles.font.family, PDFStyles.font.weights.normal);
}

/**
 * Create supplier/builder box (left side)
 */
export function createSupplierBuilderBox(
  doc: jsPDF,
  companySettings: CompanySettings,
  yPos: number
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftColumnX = pageMargin;
  const rightColumnX = pageWidth / 2 + 5;
  const boxWidth = pageWidth / 2 - 20;

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'PARTY: SUPPLIER / BUILDER',
          styles: { fillColor: PDFStyles.colors.background.section },
        },
      ],
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
            { text: '\n' + companySettings.town },
            { text: '\n' + companySettings.county },
            { text: '\n' + companySettings.post_code },
            { text: '\n' },
            { text: '\n' },
            {
              text: companySettings.phone
                ? 'Phone: ' + companySettings.phone
                : '',
            },
            {
              text: companySettings.email
                ? '\nEmail: ' + companySettings.email
                : '',
            },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: PDFStyles.colors.background.section,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: PDFStyles.font.sizes.header,
      lineWidth: 0,
      cellPadding: 2
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0,
      halign: 'left',
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth,
  });
}

/**
 * Create client/customer box (right side)
 */
export function createClientCustomerBox(
  doc: jsPDF,
  customerData: CustomerData | null,
  contract: Contract,
  yPos: number
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightColumnX = pageWidth / 2 + 5;
  const boxWidth = pageWidth / 2 - 20;

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'PARTY: CLIENT / CUSTOMER',
          styles: { fillColor: PDFStyles.colors.background.section },
        },
      ],
    ],
    body: [
      [
        {
          content: [
            {
              text: customerData?.customer_name || '',
              styles: { fontStyle: 'normal' },
            },
            {
              text: (customerData?.customer_name ? '\n' : '') + (customerData?.company_name || contract.other_party_name),
              styles: { fontStyle: 'bold' },
            },
            {
              text: customerData?.address_line1
                ? '\n' + customerData.address_line1
                : '',
            },
            {
              text: customerData?.address_line2
                ? '\n' + customerData.address_line2
                : '',
            },
            { text: customerData?.town ? '\n' + customerData.town : '' },
            { text: customerData?.county ? '\n' + customerData.county : '' },
            {
              text: customerData?.post_code
                ? '\n' + customerData.post_code
                : '',
            },
            { text: '\n' }, // Add a break line
            { text: '\n' },
            {
              text: customerData?.phone ? 'Phone: ' + customerData.phone : '',
            },
            {
              text: customerData?.email
                ? '\nEmail: ' + customerData.email
                : '',
            },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: PDFStyles.colors.background.section,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: PDFStyles.font.sizes.header,
      lineWidth: 0,
      cellPadding: 2
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0,
      halign: 'left',
    },
    margin: { left: rightColumnX, right: pageMargin },
    tableWidth: boxWidth,
  });
}

/**
 * Create project box (left side)
 */
export function createProjectBox(
  doc: jsPDF,
  projectData: ProjectData | null,
  yPos: number
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftColumnX = pageMargin;
  const rightColumnX = pageWidth / 2 + 5;
  const boxWidth = pageWidth / 2 - 20;

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'PROJECT',
          styles: { fillColor: PDFStyles.colors.background.section },
        },
      ],
    ],
    body: [
      [
        {
          content: [
            {
              text: projectData?.name || 'No project name available',
              styles: { fontStyle: 'bold' },
            },
            { text: '\n' },
            {
              text: projectData?.project_manager
                ? `Project Manager: ${projectData.project_manager}`
                : 'Project Manager: Not assigned',
            },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: PDFStyles.colors.background.section,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: PDFStyles.font.sizes.header,
      lineWidth: 0,
      cellPadding: 2
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0,
      halign: 'left',
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth,
  });
}

/**
 * Create site box (right side)
 */
export function createSiteBox(
  doc: jsPDF,
  siteData: SiteData | null,
  yPos: number
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const rightColumnX = pageWidth / 2 + 5;
  const boxWidth = pageWidth / 2 - 20;

  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'SITE',
          styles: { fillColor: PDFStyles.colors.background.section },
        },
      ],
    ],
    body: [
      [
        {
          content: [
            {
              text: siteData?.name || 'No site name available',
              styles: { fontStyle: 'bold' },
            },
            { text: siteData?.address ? '\n' + siteData.address : '' },
            { text: '\n' }, // Add a break line
            { text: '\n' }, // Add a break line
            {
              text: siteData?.site_manager
                ? 'Site Manager: ' + siteData.site_manager
                : '',
            },
            { text: siteData?.phone ? '\nPhone: ' + siteData.phone : '' },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: PDFStyles.colors.background.section,
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: PDFStyles.font.sizes.header,
      lineWidth: 0,
      cellPadding: 2
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0,
      halign: 'left',
    },
    margin: { left: rightColumnX, right: pageMargin },
    tableWidth: boxWidth,
  });
}

/**
 * Add contract sections to PDF
 */
export function addContractSections(
  doc: jsPDF,
  sections: Array<{ title: string; content: string }>,
  startY: number
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = PDFStyles.layout.contentWidth(pageWidth, pageMargin);
  
  let yPos = startY;

  for (const section of sections) {
    // Check if we need a new page before adding section
    yPos = checkNewPage(doc, 40, yPos);

    // For sections with lots of content, evaluate if there's enough space for title + enough content
    const lines = doc.splitTextToSize(section.content, contentWidth - 10);
    const headerHeight = 8; // Fixed height for header box
    const minLinesForFirstPage = 5; // Minimum lines we want to show on the first page
    const minContentHeight =
      minLinesForFirstPage * PDFStyles.spacing.lineHeight.body;
    const spaceNeededForMinContent =
      headerHeight +
      PDFStyles.spacing.sectionSpacing.after +
      minContentHeight;

    // If we can't fit the header plus minimum content, start a new page
    if (yPos + spaceNeededForMinContent > pageHeight - pageMargin) {
      doc.addPage();
      yPos = pageMargin;
    }

    // Now add the section header and content
    yPos = addSectionHeader(doc, section.title, yPos);
    yPos = addSectionContent(doc, section.content, yPos);
  }

  return yPos;
}

/**
 * Add signature section to PDF
 */
export function addSignatureSection(
  doc: jsPDF,
  companySettings: CompanySettings,
  customerData: CustomerData | null,
  contract: Contract
): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = PDFStyles.layout.contentWidth(pageWidth, pageMargin);

  // Add Signature section - force it to start on a new page
  doc.addPage(); // Always add a new page for signatures
  let yPos = pageMargin; // Reset y position to top of the new page

  yPos = addSectionHeader(doc, 'SIGNATURES', yPos);

  // Signature content
  doc.setFont(PDFStyles.font.family, PDFStyles.font.weights.normal);
  const signatureText = `This agreement is between the Supplier/Builder (${companySettings.name}) and Client (${customerData?.company_name || contract.other_party_name}), dated on ${new Date(contract.contract_date).toLocaleDateString()}, contract ID: ${contract.contract_id}. The parties have signed this Agreement on the date(s) below:`;
  
  // Split text into lines that fit within the content width
  const lines = doc.splitTextToSize(signatureText, contentWidth - 10);
  
  // Draw each line
  doc.text(lines, pageMargin + 5, yPos + 5);
  
  // Adjust yPos based on number of lines
  yPos += (lines.length * PDFStyles.spacing.lineHeight.body) + 10;

  // Calculate positions for signature lines and date lines
  const signatureLineWidth = contentWidth * 0.6; // 60% of content width for signature
  const dateLineWidth = contentWidth * 0.2; // 20% of content width for date
  const dateXPosition = pageMargin + signatureLineWidth + 10; // Position for date line

  // First signature (Company)
  // Signature line
  doc.setDrawColor(0);
  doc.line(pageMargin, yPos + 10, pageMargin + signatureLineWidth, yPos + 10);
  doc.text(
    `For and on behalf of ${
      companySettings.name ? companySettings.name : 'Company Name'
    }`,
    pageMargin,
    yPos + 15
  );

  // Date line
  doc.line(
    dateXPosition,
    yPos + 10,
    dateXPosition + dateLineWidth,
    yPos + 10
  );
  doc.text('Date of signature', dateXPosition, yPos + 15);

  yPos += 30;

  // Second signature (Client)
  // Signature line
  doc.line(pageMargin, yPos + 10, pageMargin + signatureLineWidth, yPos + 10);
  doc.text(
    `For and on behalf of ${contract.other_party_name}`,
    pageMargin,
    yPos + 15
  );

  // Date line
  doc.line(
    dateXPosition,
    yPos + 10,
    dateXPosition + dateLineWidth,
    yPos + 10
  );
  doc.text('Date of signature', dateXPosition, yPos + 15);
}
