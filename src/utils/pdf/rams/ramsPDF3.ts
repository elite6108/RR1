import { jsPDF } from 'jspdf';
import type { RAMSFormData } from '../../../types/rams';

export async function generateRAMSPDF3(
  doc: jsPDF,
  rams: RAMSFormData,
  yPos: number
): Promise<number> {
  const headerColor = '#edeaea';
  const cellBackgroundColor = '#f7f7f7';
  const borderColor = [211, 211, 211];

  // Lighting
  (doc as any).autoTable({
    startY: yPos,
    head: [['LIGHTING']],
    body: [[rams.lighting]],
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

  // Deliveries
  (doc as any).autoTable({
    startY: yPos,
    head: [['DELIVERIES']],
    body: [[rams.deliveries]],
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

  // Services
  (doc as any).autoTable({
    startY: yPos,
    head: [['SERVICES']],
    body: [[rams.services]],
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

  // Access Equipment
  (doc as any).autoTable({
    startY: yPos,
    head: [['ACCESS EQUIPMENT']],
    body: [[rams.access_equipment]],
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

  // Hazardous Equipment
  (doc as any).autoTable({
    startY: yPos,
    head: [['HAZARDOUS EQUIPMENT']],
    body: [[rams.hazardous_equipment]],
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