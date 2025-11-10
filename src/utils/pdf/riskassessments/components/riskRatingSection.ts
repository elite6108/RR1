import { PDF_STYLES } from '../utils/constants';

export const generateRiskRatingSection = (doc: any, yPos: number): number => {
  const { headerColor, borderColor } = PDF_STYLES;
  
  // Risk Rating Table
  const riskRatingTableHeaders = [['#', 'LIKELIHOOD (A)', '#', 'SEVERITY (B)', 'RISK RATING (A×B)']];
  const riskRatingTableBody = [
    [
      '1',
      'Highly unlikely',
      '1',
      'Trivial',
      { content: 'No action required (1)', styles: { fillColor: '#00B050', textColor: '#ffffff' } }
    ],
    [
      '2',
      'Unlikely',
      '2',
      'Minor Injury',
      { content: 'Low priority (2 to 6)', styles: { fillColor: '#00B050', textColor: '#ffffff' } }
    ],
    [
      '3',
      'Possible',
      '3',
      'Over 3 Day Injury',
      { content: 'Medium priority (7 to 9)', styles: { fillColor: '#FFC000', textColor: '#000000' } }
    ],
    [
      '4',
      'Probable',
      '4',
      'Major Injury',
      { content: 'High priority (10 to 14)', styles: { fillColor: '#C00000', textColor: '#ffffff' } }
    ],
    [
      '5',
      'Certain',
      '5',
      'Incapacity or Death',
      { content: 'Urgent action (15+)', styles: { fillColor: '#C00000', textColor: '#ffffff' } }
    ]
  ];

  (doc as any).autoTable({
    startY: yPos,
    head: riskRatingTableHeaders,
    body: riskRatingTableBody,
    headStyles: {
      fillColor: headerColor,
      textColor: '#000000',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20 },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 'auto' }
    },
    styles: {
      fontSize: 10,
      cellPadding: 2,
      lineWidth: 0.1,
      lineColor: borderColor,
      halign: 'left'
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
};
