import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { PurchaseOrder, CompanySettings } from '../../../../types/database';
import type { PDFTheme, PDFDimensions, SummaryCalculations } from '../types';
import { formatCurrency } from '../utils';

/**
 * Adds the main title to the PDF document
 */
export function addPDFTitle(doc: jsPDF, theme: PDFTheme): void {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(theme.themeColor);
  doc.text('PURCHASE ORDER', 195, 25, { align: 'right' });
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
}

/**
 * Creates the company information table
 */
export function addCompanyInformationTable(
  doc: jsPDF, 
  companySettings: CompanySettings, 
  theme: PDFTheme, 
  dimensions: PDFDimensions,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'COMPANY INFORMATION', styles: { fillColor: theme.detailsHeaderColor } }]],
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
      fillColor: theme.detailsHeaderColor,
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
 * Creates the order details table
 */
export function addOrderDetailsTable(
  doc: jsPDF,
  order: PurchaseOrder,
  formattedOrderNumber: string,
  projectName: string,
  theme: PDFTheme,
  dimensions: PDFDimensions,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'ORDER DETAILS', colSpan: 2, styles: { fillColor: theme.detailsHeaderColor } }]],
    body: [
      [{ content: 'ORDER NO:', styles: { fontStyle: 'bold' } }, formattedOrderNumber],
      [{ content: 'DATE:', styles: { fontStyle: 'bold' } }, new Date(order.created_at).toLocaleDateString()],
      [{ content: 'PROJECT:', styles: { fontStyle: 'bold' } }, projectName],
      [{ content: 'CREATED BY:', styles: { fontStyle: 'bold' } }, order.created_by_name]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: theme.detailsHeaderColor,
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
    columnStyles: { 
      0: { cellWidth: dimensions.boxWidth * 0.4 },
      1: { cellWidth: dimensions.boxWidth * 0.6 }
    },
    margin: { left: dimensions.rightColumnX, right: 15 },
    tableWidth: dimensions.boxWidth
  });
}

/**
 * Creates the supplier details table
 */
export function addSupplierTable(
  doc: jsPDF,
  supplierName: string,
  supplierAddress: string,
  theme: PDFTheme,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['SUPPLIER']],
    body: [
      [
        {
          content: [
            { text: supplierName, styles: { fontStyle: 'bold' } },
            { text: supplierAddress }
          ].map(item => item.text).join('\n'),
          styles: { cellPadding: { top: 5, bottom: 5, left: 5, right: 5 }, fillColor: theme.cellBackgroundColor }
        }
      ]
    ],
    headStyles: {
      fillColor: theme.supplierHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      overflow: 'linebreak',
      lineWidth: 0.1,
      lineColor: theme.borderColor
    },
    margin: { left: 15 },
    tableWidth: 85
  });
}

/**
 * Creates the delivery information table if delivery address exists
 */
export function addDeliveryTable(
  doc: jsPDF,
  deliveryTo: string,
  theme: PDFTheme,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['DELIVERY TO']],
    body: [[{ content: deliveryTo, styles: { fillColor: theme.cellBackgroundColor } }]],
    headStyles: {
      fillColor: theme.supplierHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor
    },
    margin: { left: 110 },
    tableWidth: 85
  });
}

/**
 * Creates the items table with purchase order items
 */
export function addItemsTable(
  doc: jsPDF,
  order: PurchaseOrder,
  theme: PDFTheme
): void {
  const tableHeaders = [['QTY', 'DESCRIPTION', 'UNIT', 'PER', 'PRICE', 'PER', 'TOTAL']];
  
  const tableData = order.items.map(item => [
    { content: item.qty.toString(), styles: { halign: 'center', fillColor: theme.cellBackgroundColor } },
    { content: item.description, styles: { fillColor: theme.cellBackgroundColor } },
    { content: item.units.toString(), styles: { halign: 'center', fillColor: theme.cellBackgroundColor } },
    { content: item.per_unit, styles: { halign: 'center', fillColor: theme.cellBackgroundColor } },
    { content: formatCurrency(item.price), styles: { halign: 'right', fillColor: theme.cellBackgroundColor } },
    { content: item.per_price, styles: { halign: 'center', fillColor: theme.cellBackgroundColor } },
    { content: formatCurrency(item.qty * item.price), styles: { halign: 'right', fillColor: theme.cellBackgroundColor } }
  ]);

  (doc as any).autoTable({
    startY: 145,
    head: tableHeaders,
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: theme.itemsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 51 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
      6: { cellWidth: 25 }
    },
    bodyStyles: {
      lineWidth: 0.1,
      lineColor: theme.borderColor
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    didDrawCell: (data: any) => {
      // Add bottom border to each row in the body
      if (data.section === 'body') {
        const cell = data.cell;
        const doc = data.doc;
        
        // Draw bottom border for each cell
        doc.setDrawColor(...theme.borderColor);
        doc.setLineWidth(0.1);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
      }
    }
  });
}

/**
 * Creates the summary table with subtotal, VAT, and total
 */
export function addSummaryTable(
  doc: jsPDF,
  summary: SummaryCalculations,
  theme: PDFTheme,
  startY: number
): void {
  (doc as any).autoTable({
    startY: startY,
    body: [
      [
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: 'Subtotal:', styles: { halign: 'right', fillColor: theme.cellBackgroundColor, lineWidth: 0.1, lineColor: theme.borderColor, fontStyle: 'bold' } },
        { content: formatCurrency(summary.subtotal), styles: { halign: 'right', fillColor: theme.cellBackgroundColor, lineWidth: 0.1, lineColor: theme.borderColor } }
      ],
      [
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: 'VAT:', styles: { halign: 'right', fillColor: theme.cellBackgroundColor, lineWidth: 0.1, lineColor: theme.borderColor, fontStyle: 'bold' } },
        { content: formatCurrency(summary.vat), styles: { halign: 'right', fillColor: theme.cellBackgroundColor, lineWidth: 0.1, lineColor: theme.borderColor } }
      ],
      [
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: '', styles: { fillColor: '#ffffff', lineWidth: 0 } },
        { content: 'Total:', styles: { halign: 'right', fillColor: theme.cellBackgroundColor, lineWidth: 0.1, lineColor: theme.borderColor, fontStyle: 'bold' } },
        { content: formatCurrency(summary.total), styles: { halign: 'right', fillColor: theme.cellBackgroundColor, lineWidth: 0.1, lineColor: theme.borderColor } }
      ]
    ],
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    margin: { left: 15, right: 15 }
  });
}

/**
 * Creates the notes table if notes exist
 */
export function addNotesTable(
  doc: jsPDF,
  notes: string,
  theme: PDFTheme,
  startY: number
): void {
  (doc as any).autoTable({
    startY: startY,
    head: [['NOTES']],
    body: [[{ content: notes, styles: { fillColor: theme.cellBackgroundColor } }]],
    headStyles: {
      fillColor: theme.itemsHeaderColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: theme.borderColor
    },
    margin: { left: 15, right: 15 }
  });
}
