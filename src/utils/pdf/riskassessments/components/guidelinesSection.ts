import { PDF_STYLES } from '../utils/constants';

export const generateGuidelinesSection = (doc: any, guidelines: string | undefined, yPos: number): number => {
  if (!guidelines) return yPos;

  const { cellBackgroundColor, borderColor } = PDF_STYLES;

  (doc as any).autoTable({
    startY: yPos,
    head: [['GUIDELINES']],
    body: [[guidelines]],
    headStyles: {
      fillColor: '#edeaea',
      textColor: '#000000',
      fontStyle: 'bold'
    },
    bodyStyles: {
      fillColor: cellBackgroundColor
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
