import { jsPDF } from 'jspdf';
import type { RAMSFormData } from '../../../types/rams';
import type { CompanySettings } from '../../../types/database';
import { addCompanyLogo } from './shared/companyLogo';
import { addPageNumbersAndFooter } from './shared/pageNumbering';

export async function generateRAMSPDF1(
  doc: jsPDF,
  rams: RAMSFormData,
  companySettings: CompanySettings,
  yPos: number
): Promise<number> {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15;
  const rightColumnX = pageWidth / 2 + 5;
  const boxWidth = pageWidth / 2 - 20;
  const headerColor = '#edeaea';
  const detailsHeaderColor = '#6dd187';
  const cellBackgroundColor = '#f7f7f7';
  const borderColor = [211, 211, 211];

  // Company Information (Left Box)
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'Company Information', styles: { fillColor: '#edeaea' } }]],
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
      fillColor: detailsHeaderColor,
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
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth
  });

  // Project Information (Right Box)
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'Project Information', colSpan: 2, styles: { fillColor: '#edeaea' } }]],
    body: [
      [{ content: 'Created:', styles: { fontStyle: 'bold' } }, new Date(rams.created_at).toLocaleDateString()],
      [{ content: 'Last Edited:', styles: { fontStyle: 'bold' } }, new Date(rams.updated_at).toLocaleDateString()],
      [{ content: 'RAMS Number:', styles: { fontStyle: 'bold' } }, rams.rams_number],
      [{ content: 'Reference:', styles: { fontStyle: 'bold' } }, rams.reference],
      [{ content: 'Client:', styles: { fontStyle: 'bold' } }, rams.client_name],
      [{ content: 'Site Manager:', styles: { fontStyle: 'bold' } }, rams.site_manager],
      [{ content: 'Assessor:', styles: { fontStyle: 'bold' } }, rams.assessor],
      [{ content: 'Approved By:', styles: { fontStyle: 'bold' } }, rams.approved_by]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: detailsHeaderColor,
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

  // Ensure we start after both boxes
  yPos = Math.max(
    (doc as any).lastAutoTable.finalY + 10,
    (doc as any).previousAutoTable.finalY + 10
  );

  // Site Address
  (doc as any).autoTable({
    startY: yPos,
    head: [['SITE ADDRESS']],
    body: [[
      [
        rams.address_line1,
        rams.address_line2,
        rams.address_line3,
        rams.town,
        rams.site_county,
        rams.post_code
      ].filter(Boolean).join('\n')
    ]],
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0.1,
      lineColor: borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Site Hours
  (doc as any).autoTable({
    startY: yPos,
    head: [['SITE HOURS']],
    body: [[rams.site_hours]],
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0.1,
      lineColor: borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Supervision
  (doc as any).autoTable({
    startY: yPos,
    head: [['SUPERVISION']],
    body: [[rams.supervision]],
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineWidth: 0.1,
      lineColor: borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}