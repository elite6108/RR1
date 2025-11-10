import jsPDF from 'jspdf';
import type { Quote, CompanySettings } from '../../../../types/database';
import type { PDFTheme, PDFDimensions, BankDetails } from '../types';

/**
 * Add quote title to PDF
 */
export function addQuoteTitle(doc: jsPDF, themeColor: string): void {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor);
  doc.text('QUOTE', 195, 25, { align: 'right' });

  // Reset text color
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}

/**
 * Add company information table
 */
export function addCompanyInformation(
  doc: jsPDF,
  companySettings: CompanySettings,
  dimensions: PDFDimensions,
  theme: PDFTheme,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'COMPANY INFORMATION',
          styles: { fillColor: theme.detailsHeaderColor },
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
      fillColor: theme.detailsHeaderColor,
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
 * Add quote details table
 */
export function addQuoteDetails(
  doc: jsPDF,
  quote: Quote,
  formattedQuoteNumber: string,
  projectName: string,
  dimensions: PDFDimensions,
  theme: PDFTheme,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'QUOTE DETAILS',
          colSpan: 2,
          styles: { fillColor: theme.detailsHeaderColor },
        },
      ],
    ],
    body: [
      [
        { content: 'QUOTE NO:', styles: { fontStyle: 'bold' } },
        formattedQuoteNumber,
      ],
      [
        { content: 'DATE:', styles: { fontStyle: 'bold' } },
        new Date(quote.quote_date).toLocaleDateString(),
      ],
      [{ content: 'PROJECT:', styles: { fontStyle: 'bold' } }, projectName],
      [
        { content: 'CREATED BY:', styles: { fontStyle: 'bold' } },
        quote.created_by_name,
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: theme.detailsHeaderColor,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: theme.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    columnStyles: {
      0: { cellWidth: dimensions.boxWidth * 0.4 },
      1: { cellWidth: dimensions.boxWidth * 0.6 },
    },
    margin: { left: dimensions.rightColumnX, right: 15 },
    tableWidth: dimensions.boxWidth,
  });
}

/**
 * Add customer information table
 */
export function addCustomerInformation(
  doc: jsPDF,
  customerName: string,
  customerAddress: string,
  theme: PDFTheme,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['CUSTOMER']],
    body: [
      [
        {
          content: [
            { text: customerName, styles: { fontStyle: 'bold' } },
            { text: customerAddress },
          ]
            .map((item) => item.text)
            .join('\n'),
          styles: {
            cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
            fillColor: theme.cellBackgroundColor,
          },
        },
      ],
    ],
    headStyles: {
      fillColor: theme.detailsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      overflow: 'linebreak',
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 15 },
    tableWidth: 85,
  });
}

/**
 * Add project location table
 */
export function addProjectLocation(
  doc: jsPDF,
  projectLocation: string,
  theme: PDFTheme,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['PROJECT LOCATION']],
    body: [
      [
        {
          content: projectLocation,
          styles: { fillColor: theme.cellBackgroundColor },
        },
      ],
    ],
    headStyles: {
      fillColor: theme.detailsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 110 },
    tableWidth: 85,
  });
}

/**
 * Add items table with sections
 */
export function addItemsTable(doc: jsPDF, quote: Quote, theme: PDFTheme): void {
  let currentY = 150;

  const tableHeaders = [
    [
      { content: '#', styles: { halign: 'left' } },
      { content: 'QTY', styles: { halign: 'center' } },
      { content: 'DESCRIPTION', styles: { halign: 'left' } },
      { content: 'AMOUNT', styles: { halign: 'right' } },
    ],
  ];

  // Helper function to calculate section subtotal
  const calculateSectionSubtotal = (section: any) => {
    // Use manual price if set, otherwise calculate from items
    if (section.manualPrice !== null && section.manualPrice !== undefined) {
      return section.manualPrice;
    }
    return section.items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * (item.qty ?? 1),
      0
    );
  };

  if (
    quote.sections &&
    Array.isArray(quote.sections) &&
    quote.sections.length > 0
  ) {
    // New format: use sections
    quote.sections.forEach((section: any, sectionIndex: number) => {
      // Add section title if it exists
      if (section.title && section.title.trim()) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, 14, currentY);
        currentY += 8;
      }

      // Build items data for this section
      const sectionItems = section.items.map((item: any) => [
        {
          content: item.number,
          styles: { fillColor: theme.cellBackgroundColor },
        },
        {
          content: (item.qty ?? 1).toString(),
          styles: { halign: 'center', fillColor: theme.cellBackgroundColor },
        },
        {
          content: item.description,
          styles: { fillColor: theme.cellBackgroundColor },
        },
        {
          content:
            item.price === null
              ? '-'
              : `£${item.price.toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
          styles: { halign: 'right', fillColor: theme.cellBackgroundColor },
        },
      ]);

      // Add table for this section
      (doc as any).autoTable({
        startY: currentY,
        head: tableHeaders,
        body: sectionItems,
        theme: 'plain',
        headStyles: {
          fillColor: theme.itemsHeaderColor,
          textColor: '#000000',
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 20 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 40 },
        },
        bodyStyles: {
          lineWidth: 0.1,
          lineColor: theme.borderColor,
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        didDrawCell: (data: any) => {
          if (data.section === 'body') {
            const cell = data.cell;
            const tableDoc = data.doc;

            tableDoc.setDrawColor(...theme.borderColor);
            tableDoc.setLineWidth(0.1);
            tableDoc.line(
              cell.x,
              cell.y + cell.height,
              cell.x + cell.width,
              cell.y + cell.height
            );
          }
        },
      });

      // Update currentY to after the table
      currentY = (doc as any).lastAutoTable.finalY;

      // Add section subtotal if section has items
      if (section.items.length > 0) {
        // Add top padding (10px ≈ 3.5 units in PDF)
        currentY += 10;

        // Draw a subtle separator line
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setDrawColor(200, 200, 200); // Light gray
        doc.setLineWidth(0.5);
        doc.line(pageWidth - 90, currentY - 3, pageWidth - 14, currentY - 3);

        // Add subtotal text - uses manual price if set, otherwise calculates from items
        const sectionSubtotal = calculateSectionSubtotal(section);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60); // Dark gray
        const subtotalText = `Section Subtotal: £${sectionSubtotal.toLocaleString(
          'en-GB',
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}`;
        const textWidth = doc.getTextWidth(subtotalText);
        doc.text(subtotalText, pageWidth - textWidth - 14, currentY + 2);

        // Reset text color to black for subsequent content
        doc.setTextColor(0, 0, 0);

        currentY += 12;
      } else {
        currentY += 5;
      }

      // Add spacing between sections
      if (sectionIndex < quote.sections.length - 1) {
        currentY += 5;
      }
    });
  } else if (quote.items && Array.isArray(quote.items)) {
    // Old format: use items directly (no sections)
    const tableData = quote.items.map((item: any) => [
      {
        content: item.number,
        styles: { fillColor: theme.cellBackgroundColor },
      },
      {
        content: (item.qty ?? 1).toString(),
        styles: { halign: 'center', fillColor: theme.cellBackgroundColor },
      },
      {
        content: item.description,
        styles: { fillColor: theme.cellBackgroundColor },
      },
      {
        content:
          item.price === null
            ? '-'
            : `£${item.price.toLocaleString('en-GB', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
        styles: { halign: 'right', fillColor: theme.cellBackgroundColor },
      },
    ]);

    (doc as any).autoTable({
      startY: currentY,
      head: tableHeaders,
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: theme.itemsHeaderColor,
        textColor: '#000000',
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 40 },
      },
      bodyStyles: {
        lineWidth: 0.1,
        lineColor: theme.borderColor,
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      didDrawCell: (data: any) => {
        if (data.section === 'body') {
          const cell = data.cell;
          const tableDoc = data.doc;

          tableDoc.setDrawColor(...theme.borderColor);
          tableDoc.setLineWidth(0.1);
          tableDoc.line(
            cell.x,
            cell.y + cell.height,
            cell.x + cell.width,
            cell.y + cell.height
          );
        }
      },
    });
  }
}

/**
 * Add summary table with subtotal, VAT, and total
 */
export function addSummaryTable(
  doc: jsPDF,
  quote: Quote,
  subtotal: number,
  vat: number,
  theme: PDFTheme
): void {
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 40,
    body: [
      [
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        {
          content: quote.is_subtotal_overridden
            ? 'Manual Subtotal:'
            : 'Subtotal:',
          styles: {
            halign: 'right',
            fillColor: '#f9f9f9',
            lineWidth: 0.1,
            lineColor: theme.borderColor,
            fontStyle: 'bold',
          },
        },
        {
          content: `£${subtotal.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          styles: {
            halign: 'right',
            fillColor: '#f9f9f9',
            lineWidth: 0.1,
            lineColor: theme.borderColor,
            fontStyle: 'bold',
          },
        },
      ],
      [
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        {
          content: 'VAT:',
          styles: {
            halign: 'right',
            fillColor: '#f9f9f9',
            lineWidth: 0.1,
            lineColor: theme.borderColor,
            fontStyle: 'bold',
          },
        },
        {
          content: `£${vat.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          styles: {
            halign: 'right',
            fillColor: '#f9f9f9',
            lineWidth: 0.1,
            lineColor: theme.borderColor,
            fontStyle: 'bold',
          },
        },
      ],
      [
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        {
          content: 'Total:',
          styles: {
            halign: 'right',
            fillColor: '#f9f9f9',
            lineWidth: 0.1,
            lineColor: theme.borderColor,
            fontStyle: 'bold',
          },
        },
        {
          content: `£${quote.amount.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          styles: {
            halign: 'right',
            fillColor: '#f9f9f9',
            lineWidth: 0.1,
            lineColor: theme.borderColor,
            fontStyle: 'bold',
          },
        },
      ],
    ],
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 15, right: 15 },
  });
}

/**
 * Add notes section
 */
export function addNotesSection(
  doc: jsPDF,
  notes: string,
  theme: PDFTheme,
  finalY: number
): number {
  (doc as any).autoTable({
    startY: finalY,
    head: [['NOTES']],
    body: [
      [{ content: notes, styles: { fillColor: theme.cellBackgroundColor } }],
    ],
    headStyles: {
      fillColor: theme.itemsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add due & payable section
 */
export function addDuePayableSection(
  doc: jsPDF,
  duePayable: string,
  theme: PDFTheme,
  finalY: number
): number {
  (doc as any).autoTable({
    startY: finalY,
    head: [['DUE & PAYABLE']],
    body: [
      [
        {
          content: duePayable,
          styles: { fillColor: theme.cellBackgroundColor },
        },
      ],
    ],
    headStyles: {
      fillColor: theme.itemsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add payment terms section
 */
export function addPaymentTermsSection(
  doc: jsPDF,
  paymentTerms: string,
  theme: PDFTheme,
  finalY: number
): number {
  (doc as any).autoTable({
    startY: finalY,
    head: [['PAYMENT TERMS']],
    body: [
      [
        {
          content: paymentTerms,
          styles: { fillColor: theme.cellBackgroundColor },
        },
      ],
    ],
    headStyles: {
      fillColor: theme.itemsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add bank details section
 */
export function addBankDetailsSection(
  doc: jsPDF,
  bankDetails: BankDetails,
  theme: PDFTheme,
  finalY: number
): number {
  (doc as any).autoTable({
    startY: finalY,
    head: [['BANK DETAILS']],
    body: [
      [
        {
          content: `Bank Name: ${bankDetails.bank_name}\nAccount No: ${bankDetails.account_number}\nSort Code: ${bankDetails.sort_code}`,
          styles: { fillColor: theme.cellBackgroundColor },
        },
      ],
    ],
    headStyles: {
      fillColor: theme.itemsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 15, right: 15 },
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Add terms & conditions on new page
 */
export function addTermsAndConditions(
  doc: jsPDF,
  terms: string,
  theme: PDFTheme
): void {
  doc.addPage();

  (doc as any).autoTable({
    startY: 15,
    head: [['TERMS & CONDITIONS']],
    body: [
      [{ content: terms, styles: { fillColor: theme.cellBackgroundColor } }],
    ],
    headStyles: {
      fillColor: theme.itemsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0.1,
      lineColor: theme.borderColor,
    },
    margin: { left: 15, right: 15 },
  });
}

/**
 * Add page numbers and footer to all pages
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
