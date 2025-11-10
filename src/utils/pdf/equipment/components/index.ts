import jsPDF from 'jspdf';
import type { EquipmentChecklist, Equipment, CompanySettings, PDFDimensions } from '../types';
import { PDF_THEME } from '../utils';

/**
 * Generate company information table
 */
export function generateCompanyInfoTable(
  doc: jsPDF,
  companySettings: CompanySettings,
  dimensions: PDFDimensions,
  yPos: number
): void {
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
    margin: { left: dimensions.leftColumnX, right: dimensions.rightColumnX },
    tableWidth: dimensions.boxWidth
  });
}

/**
 * Generate equipment details table
 */
export function generateEquipmentDetailsTable(
  doc: jsPDF,
  checklist: EquipmentChecklist,
  equipment: Equipment,
  dimensions: PDFDimensions,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'EQUIPMENT DETAILS', colSpan: 2 }]],
    body: [
      [{ content: 'EQUIPMENT:', styles: { fontStyle: 'bold' } }, equipment.name],
      [{ content: 'SERIAL NO:', styles: { fontStyle: 'bold' } }, equipment.serial_number],
      [{ content: 'DATE:', styles: { fontStyle: 'bold' } }, new Date(checklist.check_date).toLocaleDateString()],
      [{ content: 'EXAMINER:', styles: { fontStyle: 'bold' } }, checklist.created_by_name],
      [{ content: 'FREQUENCY:', styles: { fontStyle: 'bold' } }, checklist.frequency.charAt(0).toUpperCase() + checklist.frequency.slice(1)],
      [{ 
        content: 'STATUS:', 
        styles: { fontStyle: 'bold' } 
      }, { 
        content: checklist.status.toUpperCase(),
        styles: { 
          textColor: checklist.status.toUpperCase() === 'FAIL' ? '#FF0000' : '#18ca3d'
        }
      }]
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
      0: { cellWidth: dimensions.boxWidth * 0.4 },
      1: { cellWidth: dimensions.boxWidth * 0.6 }
    },
    margin: { left: dimensions.rightColumnX, right: 15 },
    tableWidth: dimensions.boxWidth
  });
}

/**
 * Generate checklist items table
 */
export function generateChecklistItemsTable(
  doc: jsPDF,
  checklist: EquipmentChecklist,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['ITEM', 'STATUS', 'NOTES']],
    body: checklist.items.map(item => [
      item.name,
      { 
        content: item.status.toUpperCase(),
        styles: { 
          textColor: item.status.toUpperCase() === 'FAIL' ? '#FF0000' : '#18ca3d'
        }
      },
      item.notes || '-'
    ]),
    headStyles: {
      fillColor: '#edeaea',
      textColor: '#000000',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' }
    },
    bodyStyles: {
      fillColor: PDF_THEME.cellBackgroundColor
    },
    alternateRowStyles: {
      fillColor: '#ffffff'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: PDF_THEME.borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });
}

/**
 * Generate additional notes table if notes exist
 */
export function generateAdditionalNotesTable(
  doc: jsPDF,
  checklist: EquipmentChecklist,
  yPos: number
): void {
  if (!checklist.notes) {
    return;
  }

  (doc as any).autoTable({
    startY: yPos,
    head: [['ADDITIONAL NOTES']],
    body: [[checklist.notes]],
    headStyles: {
      fillColor: '#edeaea',
      textColor: '#000000',
      fontStyle: 'bold'
    },
    bodyStyles: {
      fillColor: PDF_THEME.cellBackgroundColor
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: PDF_THEME.borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });
}

/**
 * Get the final Y position after the last table
 */
export function getLastTableFinalY(doc: jsPDF): number {
  return (doc as any).lastAutoTable.finalY;
}
