import { PDF_STYLES } from '../utils/constants';
import type { RiskAssessment } from '../types';

export const generateWorkingMethodsSection = (
  doc: any, 
  workingMethods: RiskAssessment['working_methods'], 
  yPos: number
): number => {
  if (workingMethods.length === 0) return yPos;

  const { cellBackgroundColor, borderColor } = PDF_STYLES;

  (doc as any).autoTable({
    startY: yPos,
    head: [['#', 'WORKING METHOD']],
    body: workingMethods.map((method: any) => [
      method.number,
      method.description
    ]),
    headStyles: {
      fillColor: '#edeaea',
      textColor: '#000000',
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 'auto' }
    },
    bodyStyles: {
      fillColor: cellBackgroundColor
    },
    alternateRowStyles: {
      fillColor: '#ffffff'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
};
