import { jsPDF } from 'jspdf';
import type { RAMSFormData } from '../../../types/rams';

export async function generateRAMSPDF2(
  doc: jsPDF,
  rams: RAMSFormData,
  yPos: number
): Promise<number> {
  const headerColor = '#edeaea';
  const cellBackgroundColor = '#f7f7f7';
  const borderColor = [211, 211, 211];

  // Description
  (doc as any).autoTable({
    startY: yPos,
    head: [['DESCRIPTION OF WORKS']],
    body: [[rams.description]],
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

  // Sequence
  (doc as any).autoTable({
    startY: yPos,
    head: [['SEQUENCE OF OPERATIONS']],
    body: [[rams.sequence]],
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

  // Stability
  (doc as any).autoTable({
    startY: yPos,
    head: [['STABILITY']],
    body: [[rams.stability]],
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

  // Special Permits
  (doc as any).autoTable({
    startY: yPos,
    head: [['SPECIAL PERMITS']],
    body: [[rams.special_permits]],
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

  // Workers
  (doc as any).autoTable({
    startY: yPos,
    head: [['WORKERS']],
    body: [[rams.workers]],
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

  // Tools Equipment
  (doc as any).autoTable({
    startY: yPos,
    head: [['TOOLS EQUIPMENT']],
    body: [[rams.tools_equipment]],
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

  // Plant Equipment
  (doc as any).autoTable({
    startY: yPos,
    head: [['PLANT EQUIPMENT']],
    body: [[rams.plant_equipment]],
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