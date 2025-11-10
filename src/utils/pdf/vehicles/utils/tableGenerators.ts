import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { VehicleChecklist, Vehicle, CompanySettings } from '../types';
import { PDF_THEME, TABLE_STYLES, LAYOUT_CONFIG, CHECK_CATEGORIES, STATUS_COLORS } from './constants';

/**
 * Generates the company information table
 * @param doc - jsPDF document instance
 * @param companySettings - Company settings data
 * @param yPos - Y position to start the table
 * @param leftColumnX - X position for left column
 * @param boxWidth - Width of the table box
 */
export function generateCompanyInfoTable(
  doc: jsPDF,
  companySettings: CompanySettings,
  yPos: number,
  leftColumnX: number,
  boxWidth: number
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
      lineColor: TABLE_STYLES.lineColor
    },
    margin: { left: leftColumnX, right: leftColumnX + boxWidth },
    tableWidth: boxWidth
  });
}

/**
 * Generates the vehicle details table
 * @param doc - jsPDF document instance
 * @param checklist - Vehicle checklist data
 * @param vehicle - Vehicle data
 * @param yPos - Y position to start the table
 * @param rightColumnX - X position for right column
 * @param boxWidth - Width of the table box
 */
export function generateVehicleDetailsTable(
  doc: jsPDF,
  checklist: VehicleChecklist,
  vehicle: Vehicle,
  yPos: number,
  rightColumnX: number,
  boxWidth: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'VEHICLE DETAILS', colSpan: 2, styles: { fillColor: PDF_THEME.detailsHeaderColor } }]],
    body: [
      [{ content: 'VEHICLE:', styles: { fontStyle: 'bold' } }, `${vehicle.make} ${vehicle.model} (${vehicle.registration})`],
      [{ content: 'DATE:', styles: { fontStyle: 'bold' } }, new Date(checklist.check_date).toLocaleDateString()],
      [{ content: 'EXAMINER:', styles: { fontStyle: 'bold' } }, checklist.created_by_name],
      [{ content: 'DRIVER:', styles: { fontStyle: 'bold' } }, checklist.driver_name],
      [{ content: 'MILEAGE:', styles: { fontStyle: 'bold' } }, checklist.mileage],
      [{ content: 'FREQUENCY:', styles: { fontStyle: 'bold' } }, checklist.frequency.charAt(0).toUpperCase() + checklist.frequency.slice(1)],
      [{ 
        content: 'STATUS:', 
        styles: { fontStyle: 'bold' } 
      }, { 
        content: checklist.status.toUpperCase(),
        styles: { 
          textColor: checklist.status.toUpperCase() === 'FAIL' ? STATUS_COLORS.FAIL : STATUS_COLORS.PASS
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
      fontSize: TABLE_STYLES.fontSize,
      cellPadding: TABLE_STYLES.cellPadding,
      fillColor: PDF_THEME.cellBackgroundColor,
      lineWidth: TABLE_STYLES.lineWidth,
      lineColor: TABLE_STYLES.lineColor
    },
    columnStyles: { 
      0: { cellWidth: boxWidth * 0.4 },
      1: { cellWidth: boxWidth * 0.6 }
    },
    margin: { left: rightColumnX, right: LAYOUT_CONFIG.rightMargin },
    tableWidth: boxWidth
  });
}

/**
 * Generates the outside checks table
 * @param doc - jsPDF document instance
 * @param checklist - Vehicle checklist data
 * @param yPos - Y position to start the table
 * @returns New Y position after the table
 */
export function generateOutsideChecksTable(
  doc: jsPDF,
  checklist: VehicleChecklist,
  yPos: number
): number {
  const outsideChecks = checklist.items.filter(item => 
    CHECK_CATEGORIES.OUTSIDE_CHECKS.includes(item.name)
  );

  if (outsideChecks.length === 0) {
    return yPos;
  }

  (doc as any).autoTable({
    startY: yPos,
    head: [['OUTSIDE CHECKS', 'STATUS', 'NOTES']],
    body: outsideChecks.map(item => [
      item.name,
      { 
        content: item.status.toUpperCase(),
        styles: { 
          textColor: item.status.toUpperCase() === 'FAIL' ? STATUS_COLORS.FAIL : STATUS_COLORS.PASS
        }
      },
      item.notes || '-'
    ]),
    headStyles: {
      fillColor: PDF_THEME.headerColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 'auto' }
    },
    bodyStyles: {
      fillColor: PDF_THEME.cellBackgroundColor
    },
    alternateRowStyles: {
      fillColor: '#ffffff'
    },
    styles: {
      fontSize: TABLE_STYLES.fontSize,
      cellPadding: TABLE_STYLES.cellPadding,
      lineWidth: TABLE_STYLES.lineWidth,
      lineColor: TABLE_STYLES.lineColor
    },
    theme: 'plain',
    margin: { left: LAYOUT_CONFIG.leftMargin, right: LAYOUT_CONFIG.rightMargin }
  });

  return (doc as any).lastAutoTable.finalY + LAYOUT_CONFIG.sectionSpacing;
}

/**
 * Generates the inside checks table
 * @param doc - jsPDF document instance
 * @param checklist - Vehicle checklist data
 * @param yPos - Y position to start the table
 * @returns New Y position after the table
 */
export function generateInsideChecksTable(
  doc: jsPDF,
  checklist: VehicleChecklist,
  yPos: number
): number {
  const insideChecks = checklist.items.filter(item => 
    CHECK_CATEGORIES.INSIDE_CHECKS.includes(item.name)
  );

  if (insideChecks.length === 0) {
    return yPos;
  }

  (doc as any).autoTable({
    startY: yPos,
    head: [['INSIDE CHECKS', 'STATUS', 'NOTES']],
    body: insideChecks.map(item => [
      item.name,
      { 
        content: item.status.toUpperCase(),
        styles: { 
          textColor: item.status.toUpperCase() === 'FAIL' ? STATUS_COLORS.FAIL : STATUS_COLORS.PASS
        }
      },
      item.notes || '-'
    ]),
    headStyles: {
      fillColor: PDF_THEME.headerColor,
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
      fontSize: TABLE_STYLES.fontSize,
      cellPadding: TABLE_STYLES.cellPadding,
      lineWidth: TABLE_STYLES.lineWidth,
      lineColor: TABLE_STYLES.lineColor
    },
    theme: 'plain',
    margin: { left: LAYOUT_CONFIG.leftMargin, right: LAYOUT_CONFIG.rightMargin }
  });

  return (doc as any).lastAutoTable.finalY + LAYOUT_CONFIG.sectionSpacing;
}

/**
 * Generates the additional notes table
 * @param doc - jsPDF document instance
 * @param checklist - Vehicle checklist data
 * @param yPos - Y position to start the table
 */
export function generateAdditionalNotesTable(
  doc: jsPDF,
  checklist: VehicleChecklist,
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
      lineColor: TABLE_STYLES.lineColor
    },
    theme: 'plain',
    margin: { left: LAYOUT_CONFIG.leftMargin, right: LAYOUT_CONFIG.rightMargin }
  });
}
