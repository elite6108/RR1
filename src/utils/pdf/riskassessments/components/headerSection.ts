import type { CompanySettings } from '../../../../types/database';
import type { RiskAssessment } from '../types';
import { PDF_STYLES } from '../utils/constants';
import { loadCompanyLogo } from '../utils/helpers';

export const generateHeaderSection = async (
  doc: any, 
  assessment: RiskAssessment, 
  companySettings: CompanySettings
): Promise<number> => {
  const { themeColor, headerColor, cellBackgroundColor, borderColor } = PDF_STYLES;
  
  // Set default font
  doc.setFont('helvetica');

  // Add company logo if exists
  if (companySettings.logo_url) {
    await loadCompanyLogo(companySettings.logo_url, doc);
  }

  // Title
  doc.setFontSize(PDF_STYLES.fontSize.title);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor);
  doc.text('RISK ASSESSMENT', 190, 25, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(0);
  doc.setFontSize(PDF_STYLES.fontSize.normal);
  doc.setFont('helvetica', 'normal');
  
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15; // Left margin
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing
  
  let yPos = 45;
  
  // Company Information (Left Box)
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
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth
  });
  
  // Assessment Details (Right Box)
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'ASSESSMENT DETAILS', colSpan: 2, styles: { fillColor: '#edeaea' } }]],
    body: [
      [{ content: 'RA Number:', styles: { fontStyle: 'bold' } }, assessment.ra_id],
      [{ content: 'CREATED:', styles: { fontStyle: 'bold' } }, new Date(assessment.creation_date).toLocaleDateString()],
      [{ content: 'LOCATION:', styles: { fontStyle: 'bold' } }, assessment.location],
      [{ content: 'ASSESSOR:', styles: { fontStyle: 'bold' } }, assessment.assessor]
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

  // Ensure we start after both boxes
  yPos = Math.max(
    (doc as any).lastAutoTable.finalY + 10,
    (doc as any).previousAutoTable.finalY + 10
  );

  return yPos;
};
