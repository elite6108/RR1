import { jsPDF } from 'jspdf';
import type { RAMSFormData } from '../../../types/rams';

export async function generateRAMSPDF7(
  doc: jsPDF,
  rams: RAMSFormData,
  yPos: number
): Promise<number> {
  const headerColor = '#edeaea';
  const cellBackgroundColor = '#f7f7f7';
  const borderColor = [211, 211, 211];

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

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Hazards
  if (rams.hazards && rams.hazards.length > 0) {
    for (const hazard of rams.hazards) {
      (doc as any).autoTable({
        startY: yPos,
        head: [[{ content: `HAZARD: ${hazard.title}`, colSpan: 6, styles: { fillColor: '#004EA8', textColor: '#ffffff' } }]],
        body: [
          [{ content: 'WHO MIGHT BE HARMED:', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }, { content: hazard.whoMightBeHarmed, colSpan: 4, styles: { fillColor: '#ffffff' } }],
          [{ content: 'HOW MIGHT THEY BE HARMED:', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }, { content: hazard.howMightBeHarmed, colSpan: 4, styles: { fillColor: '#ffffff' } }],
          [{ content: 'Risk Calculation (Before Control Measures)', colSpan: 6, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }],
          [
            { content: 'LIKELIHOOD', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: hazard.beforeLikelihood, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: 'SEVERITY', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: hazard.beforeSeverity, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: 'TOTAL RISK', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: hazard.beforeTotal, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }
          ],
          [{ content: 'Existing Control Measures', colSpan: 6, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }],
          ...hazard.controlMeasures.map(m => [{ content: `• ${m.description}`, colSpan: 6, styles: { fillColor: '#ffffff' } }]),
          [{ content: 'Risk Calculation (After Control Measures)', colSpan: 6, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }],
          [
            { content: 'LIKELIHOOD', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: hazard.afterLikelihood, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: 'SEVERITY', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: hazard.afterSeverity, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: 'TOTAL RISK', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
            { content: hazard.afterTotal, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }
          ]
        ],
        headStyles: {
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 20 },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 20 }
        },
        bodyStyles: {
          fillColor: cellBackgroundColor
        },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineWidth: 0.1,
          lineColor: borderColor
        },
        theme: 'plain',
        margin: { left: 15, right: 15 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Add page break if there's not enough space for next hazard
      if (yPos > doc.internal.pageSize.height - 100 && hazard !== rams.hazards[rams.hazards.length - 1]) {
        doc.addPage();
        yPos = 15;
      }
    }
  }

  return yPos;
}