import { PDF_STYLES } from '../utils/constants';
import type { RiskAssessment } from '../types';

export const generateHazardsSection = (
  doc: any, 
  hazards: RiskAssessment['hazards'], 
  yPos: number
): number => {
  if (hazards.length === 0) return yPos;

  const { cellBackgroundColor, borderColor } = PDF_STYLES;
  let currentYPos = yPos;

  for (const hazard of hazards) {
    // Hazard Title Header
    (doc as any).autoTable({
      startY: currentYPos,
      head: [[{ content: `HAZARD: ${hazard.title}`, colSpan: 6, styles: { fillColor: '#004EA8', textColor: '#ffffff' } }]],
      body: [
        [{ content: 'WHO MIGHT BE HARMED:', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }, { content: hazard.whoMightBeHarmed, colSpan: 4, styles: { fillColor: '#ffffff' } }],
        [{ content: 'HOW MIGHT THEY BE HARMED:', colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }, { content: hazard.howMightBeHarmed, colSpan: 4, styles: { fillColor: '#ffffff' } }],
        [{ content: 'RISK CALCULATION (BEFORE CONTROL MEASURES)', colSpan: 6, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }],
        [
          { content: 'LIKELIHOOD', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
          { content: hazard.beforeLikelihood, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
          { content: 'SEVERITY', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
          { content: hazard.beforeSeverity, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
          { content: 'TOTAL RISK', styles: { fontStyle: 'bold', fillColor: '#EDEDED' } },
          { content: hazard.beforeTotal, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }
        ],
        [{ content: 'EXISTING CONTROL MEASURES', colSpan: 6, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }],
        ...hazard.controlMeasures.map((m: { description: string }) => [{ 
          content: `• ${m.description}`, 
          colSpan: 6, 
          styles: { fillColor: '#ffffff' } 
        }]),
        [{ content: 'RISK CALCULATION (AFTER CONTROL MEASURES)', colSpan: 6, styles: { fontStyle: 'bold', fillColor: '#EDEDED' } }],
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

    currentYPos = (doc as any).lastAutoTable.finalY + 10;

    // Add page break if there's not enough space for next hazard
    if (currentYPos > doc.internal.pageSize.height - 100 && hazard !== hazards[hazards.length - 1]) {
      doc.addPage();
      currentYPos = 15;
    }
  }

  return currentYPos;
};
