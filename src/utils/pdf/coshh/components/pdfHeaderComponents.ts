import { CompanySettings, PDFStyles } from '../types';
import { buildCompanyInfoText } from '../utils/companyHelpers';
import { formatDate } from '../utils/dataHelpers';

// Create company information table for PDF header
export const createCompanyInfoTable = (
  doc: any,
  companySettings: CompanySettings,
  styles: PDFStyles,
  yPos: number,
  leftColumnX: number,
  rightColumnX: number,
  boxWidth: number
): void => {
  (doc as any).autoTable({
    startY: yPos,
    head: [['COMPANY INFORMATION']],
    body: [
      [{
        content: buildCompanyInfoText(companySettings),
        styles: { cellWidth: 'auto', halign: 'left' }
      }]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: styles.headerColor,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: styles.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: styles.borderColor
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth
  });
};

// Create register details table for register PDF
export const createRegisterDetailsTable = (
  doc: any,
  substanceCount: number,
  lastUpdated: string,
  styles: PDFStyles,
  yPos: number,
  rightColumnX: number,
  boxWidth: number
): void => {
  (doc as any).autoTable({
    startY: yPos,
    head: [['REGISTER DETAILS']],
    body: [
      [{ 
        content: [
          `Generated: ${formatDate(new Date().toISOString())}`,
          `\nTotal Substances: ${substanceCount}`,
          `\nLast Updated: ${lastUpdated}`,
          '\n\nThis register contains all COSHH substances currently stored and managed by the organisation.'
        ].join(''),
        styles: { cellWidth: 'auto', halign: 'left' }
      }]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: styles.headerColor,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: styles.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: styles.borderColor
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth
  });
};

// Create assessment details table for assessment PDF
export const createAssessmentDetailsTable = (
  doc: any,
  assessmentDate: string,
  reviewDate: string,
  assessorName: string,
  coshhReference: string,
  hazardLevel: string,
  styles: PDFStyles,
  yPos: number,
  rightColumnX: number,
  boxWidth: number
): void => {
  (doc as any).autoTable({
    startY: yPos,
    head: [['ASSESSMENT DETAILS']],
    body: [
      [{
        content: [
          `Assessment Date: ${formatDate(assessmentDate)}`,
          `Review Date: ${formatDate(reviewDate)}`,
          `Assessor: ${assessorName || 'N/A'}`,
          `COSHH Reference: ${coshhReference || 'N/A'}`,
          hazardLevel ? `Hazard Level: ${hazardLevel}` : '',
          '',
        ].filter(line => line).join('\n'),
        styles: { cellWidth: 'auto', halign: 'left' }
      }]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: styles.headerColor,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: styles.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: styles.borderColor
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth
  });
};

// Add PDF title to document
export const addPDFTitle = (doc: any, title: string, themeColor: string): void => {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor);
  
  if (title === 'COSHH REGISTER') {
    doc.text(title, 280, 25, { align: 'right' }); // Landscape orientation
  } else {
    doc.text(title, 190, 25, { align: 'right' }); // Portrait orientation
  }
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
};
