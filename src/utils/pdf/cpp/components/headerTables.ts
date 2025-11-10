import jsPDF from 'jspdf';
import type { CompanySettings } from '../../types/database';

// Create company information table
export const createCompanyInfoTable = (
  doc: jsPDF, 
  companySettings: CompanySettings, 
  yPos: number, 
  leftColumnX: number, 
  boxWidth: number,
  cellBackgroundColor: string,
  borderColor: [number, number, number]
): void => {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'COMPANY INFORMATION', styles: { fillColor: '#edeaea' } }]],
    body: [[{
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
    }]],
    theme: 'grid',
    headStyles: {
      fillColor: '#6dd187',
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor
    },
    margin: { left: leftColumnX, right: leftColumnX + boxWidth },
    tableWidth: boxWidth
  });
};

// Create CPP details table
export const createCPPDetailsTable = (
  doc: jsPDF,
  cpp: any,
  yPos: number,
  rightColumnX: number,
  boxWidth: number,
  cellBackgroundColor: string,
  borderColor: [number, number, number]
): void => {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'CPP Details', colSpan: 2, styles: { fillColor: '#edeaea' } }]],
    body: [
      [{ content: 'CPP NO:', styles: { fontStyle: 'bold' } }, cpp.cpp_number],
      [{ content: 'CREATION:', styles: { fontStyle: 'bold' } }, new Date(cpp.created_at).toLocaleDateString()],
      [{ content: 'PROJECT:', styles: { fontStyle: 'bold' } }, cpp.front_cover?.projectName || ''],
      [{ content: 'APPROVED', styles: { fontStyle: 'bold' } }, 'R. Stewart'],
      [{ content: 'VERSION:', styles: { fontStyle: 'bold' } }, cpp.front_cover?.version || '']
    ],
    theme: 'grid',
    headStyles: {
      fillColor: '#6dd187',
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor
    },
    columnStyles: {
      0: { cellWidth: boxWidth * 0.4 },
      1: { cellWidth: boxWidth * 0.6 }
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth
  });
};
