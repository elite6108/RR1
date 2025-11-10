import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CompanySettings } from '../../../../types/database';
import type { PDFDimensions } from '../types';
import { PDF_THEME, PDF_STYLES } from './constants';

/**
 * Generates the company information table
 */
export function generateCompanyInfoTable(
  doc: jsPDF,
  companySettings: CompanySettings,
  dimensions: PDFDimensions,
  yPos: number
): void {
  const companyContent = [
    { text: companySettings.name, styles: { fontStyle: 'bold' } },
    { text: '\n' + companySettings.address_line1 },
    { text: companySettings.address_line2 ? '\n' + companySettings.address_line2 : '' },
    { text: `\n${companySettings.town}, ${companySettings.county}` },
    { text: '\n' + companySettings.post_code },
    { text: '\n\n' + companySettings.phone },
    { text: '\n' + companySettings.email }
  ].map(item => item.text).join('');

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ 
      content: 'COMPANY INFORMATION', 
      styles: { fillColor: PDF_THEME.detailsHeaderColor } 
    }]],
    body: [[{
      content: companyContent,
      styles: { cellWidth: 'auto', halign: 'left' }
    }]],
    theme: 'grid',
    headStyles: {
      fillColor: PDF_THEME.detailsHeaderColor,
      textColor: 'black',
      fontStyle: PDF_STYLES.font.bold
    },
    styles: {
      fontSize: PDF_STYLES.table.fontSize,
      cellPadding: PDF_STYLES.table.cellPadding,
      fillColor: PDF_THEME.cellBackgroundColor,
      lineWidth: PDF_STYLES.table.lineWidth,
      lineColor: PDF_THEME.borderColor
    },
    margin: { 
      left: dimensions.leftColumnX, 
      right: dimensions.rightColumnX 
    },
    tableWidth: dimensions.boxWidth
  });
}

/**
 * Generates the toolbox talk information table
 */
export function generateTalkInfoTable(
  doc: jsPDF,
  talk: any,
  dimensions: PDFDimensions,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ 
      content: 'TOOLBOX TALK INFORMATION', 
      colSpan: 2, 
      styles: { fillColor: PDF_THEME.detailsHeaderColor } 
    }]],
    body: [
      [
        { content: 'TALK NUMBER:', styles: { fontStyle: PDF_STYLES.font.bold } }, 
        talk.talk_number
      ],
      [
        { content: 'DATE:', styles: { fontStyle: PDF_STYLES.font.bold } }, 
        new Date(talk.completed_date).toLocaleDateString()
      ],
      [
        { content: 'SITE REFERENCE:', styles: { fontStyle: PDF_STYLES.font.bold } }, 
        talk.site_reference
      ],
      [
        { content: 'PROJECT:', styles: { fontStyle: PDF_STYLES.font.bold } }, 
        talk.project?.name
      ],
      [
        { content: 'PRESENTER:', styles: { fontStyle: PDF_STYLES.font.bold } }, 
        talk.presenter
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: PDF_THEME.detailsHeaderColor,
      textColor: 'black',
      fontStyle: PDF_STYLES.font.bold,
      halign: 'left'
    },
    styles: {
      fontSize: PDF_STYLES.table.fontSize,
      cellPadding: PDF_STYLES.table.cellPadding,
      fillColor: PDF_THEME.cellBackgroundColor,
      lineWidth: PDF_STYLES.table.lineWidth,
      lineColor: PDF_THEME.borderColor
    },
    columnStyles: {
      0: { cellWidth: dimensions.boxWidth * 0.4 },
      1: { cellWidth: dimensions.boxWidth * 0.6 }
    },
    margin: { 
      left: dimensions.rightColumnX, 
      right: 15 
    },
    tableWidth: dimensions.boxWidth
  });
}

/**
 * Generates the toolbox talk title table
 */
export function generateTalkTitleTable(
  doc: jsPDF,
  talk: any,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['TOOLBOX TALK']],
    body: [[talk.title]],
    headStyles: {
      fillColor: PDF_THEME.headerColor,
      textColor: PDF_THEME.themeColor,
      fontStyle: PDF_STYLES.font.bold
    },
    styles: {
      fontSize: PDF_STYLES.table.fontSize,
      cellPadding: PDF_STYLES.table.cellPadding,
      lineWidth: PDF_STYLES.table.lineWidth,
      lineColor: PDF_THEME.borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });
}

/**
 * Generates the attendees table
 */
export function generateAttendeesTable(
  doc: jsPDF,
  talk: any,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [['NAME', 'DATE SIGNED', 'SIGNATURE']],
    body: talk.attendees.map((attendee: any) => [
      { content: attendee.name, styles: { fontStyle: PDF_STYLES.font.bold } },
      new Date(talk.completed_date).toLocaleDateString(),
      { content: 'Signed', styles: { textColor: [0, 128, 0] } }
    ]),
    headStyles: {
      fillColor: PDF_THEME.headerColor,
      textColor: PDF_THEME.themeColor,
      fontStyle: PDF_STYLES.font.bold
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 }
    },
    bodyStyles: {
      fillColor: PDF_THEME.cellBackgroundColor
    },
    styles: {
      fontSize: PDF_STYLES.table.fontSize,
      cellPadding: PDF_STYLES.table.cellPadding,
      lineWidth: PDF_STYLES.table.lineWidth,
      lineColor: PDF_THEME.borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });
}
