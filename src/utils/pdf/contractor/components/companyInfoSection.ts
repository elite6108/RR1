import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { CompanySettings, Subcontractor, PDFTheme } from '../types';

export const addCompanyInfoSection = (
  doc: jsPDF,
  companySettings: CompanySettings,
  contractor: Subcontractor,
  theme: PDFTheme,
  dimensions: { leftColumnX: number; rightColumnX: number; boxWidth: number },
  yPos: number
): number => {
  const { leftColumnX, rightColumnX, boxWidth } = dimensions;
  const { headerColor, cellBackgroundColor, borderColor } = theme;

  // Company Information (Left Box)
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [
        {
          content: 'COMPANY INFORMATION',
          styles: { fillColor: headerColor },
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
            { text: '\n\n'+ companySettings.phone },
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
      fillColor: headerColor,
      textColor: 'black',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth,
  });

  // Contractor Details (Right Box) - Single cell format with multiple lines
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{ content: 'CONTRACTOR DETAILS', styles: { fillColor: headerColor } }],
    ],
    body: [
      [
        {
          content: [
            { text: contractor.company_name, styles: { fontStyle: 'bold' } },
            { text: '\n' + contractor.address },
            { text: '\n'+ contractor.phone },
            { text: '\n' + contractor.email },
            {
              text:
                '\n\nReview Date: ' +
                new Date(contractor.review_date).toLocaleDateString(),
            },
            { text: '\nServices: ' + contractor.services_provided },
            {
              text: '\nNature of Business: ' + contractor.nature_of_business,
            },
          ]
            .map((item) => item.text)
            .join(''),
          styles: { cellWidth: 'auto', halign: 'left' },
        },
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: headerColor,
      textColor: 'black',
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: borderColor,
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth,
  });

  // Ensure we start after both boxes
  return Math.max(
    (doc as any).lastAutoTable.finalY + 10,
    (doc as any).previousAutoTable.finalY + 10
  );
};
