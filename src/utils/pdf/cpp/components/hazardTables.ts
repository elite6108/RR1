import jsPDF from 'jspdf';
import type { HazardData } from '../types';

// Create hazards tables
export const createHazardsTables = (
  doc: jsPDF,
  hazardsData: HazardData | HazardData[],
  yPos: number,
  borderColor: [number, number, number]
): number => {
  console.log('Processing Hazards section with data:', hazardsData);
  
  // Ensure content is treated as an array
  let hazardsArray: HazardData[];
  if (Array.isArray(hazardsData)) {
    hazardsArray = hazardsData;
  } else if (hazardsData && typeof hazardsData === 'object') {
    hazardsArray = [hazardsData];
  } else {
    console.log('No valid hazards data found');
    return yPos;
  }
  
  if (!hazardsArray || hazardsArray.length === 0) {
    console.log('No hazards in array');
    return yPos;
  }

  let currentY = yPos;

  // Create tables for each hazard
  hazardsArray.forEach((hazard: HazardData, index: number) => {
    if (!hazard) return;

    // Add extra spacing between hazards
    if (index > 0) {
      currentY += 10;
    }

    // Check if we need a page break before starting this hazard
    if (currentY > doc.internal.pageSize.height - 100) {
      doc.addPage();
      currentY = 15;
    }

    (doc as any).autoTable({
      startY: currentY,
      head: [
        [{
          content: `HAZARD: ${hazard.title}`,
          colSpan: 6,
          styles: {
            fillColor: '#004EA8',
            textColor: '#ffffff'
          }
        }]
      ],
      body: [
        [
          {
            content: 'WHO MIGHT BE HARMED:',
            colSpan: 2,
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.whoMightBeHarmed || '',
            colSpan: 4,
            styles: {
              fillColor: '#ffffff'
            }
          }
        ],
        [
          {
            content: 'HOW MIGHT THEY BE HARMED:',
            colSpan: 2,
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.howMightBeHarmed || '',
            colSpan: 4,
            styles: {
              fillColor: '#ffffff'
            }
          }
        ],
        [
          {
            content: 'Risk Calculation (Before Control Measures)',
            colSpan: 6,
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          }
        ],
        [
          {
            content: 'LIKELIHOOD',
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.beforeLikelihood || '',
            styles: {
              fillColor: '#ffffff'
            }
          },
          {
            content: 'SEVERITY',
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.beforeSeverity || '',
            styles: {
              fillColor: '#ffffff'
            }
          },
          {
            content: 'TOTAL RISK',
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.beforeTotal || '',
            styles: {
              fillColor: '#ffffff'
            }
          }
        ],
        [
          {
            content: 'Control Measures',
            colSpan: 6,
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          }
        ],
        ...(hazard.controlMeasures?.map((measure: any) => [
          {
            content: `• ${measure.description || ''}`,
            colSpan: 6,
            styles: {
              fillColor: '#ffffff'
            }
          }
        ]) || []),
        [
          {
            content: 'Risk Calculation (After Control Measures)',
            colSpan: 6,
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          }
        ],
        [
          {
            content: 'LIKELIHOOD',
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.afterLikelihood || '',
            styles: {
              fillColor: '#ffffff'
            }
          },
          {
            content: 'SEVERITY',
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.afterSeverity || '',
            styles: {
              fillColor: '#ffffff'
            }
          },
          {
            content: 'TOTAL RISK',
            styles: {
              fontStyle: 'bold',
              fillColor: '#EDEDED'
            }
          },
          {
            content: hazard.afterTotal || '',
            styles: {
              fillColor: '#ffffff'
            }
          }
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
        fontSize: 10,
        cellPadding: 4
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
        lineWidth: 0.1,
        lineColor: borderColor
      },
      theme: 'grid',
      margin: { left: 15, right: 15 }
    });

    currentY = (doc as any).lastAutoTable.finalY;
  });

  return currentY + 10; // Add a small spacing after the last hazard table
};
