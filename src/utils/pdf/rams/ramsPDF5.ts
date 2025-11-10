import { jsPDF } from 'jspdf';
import type { RAMSFormData } from '../../../types/rams';

export async function generateRAMSPDF5(
  doc: jsPDF,
  rams: RAMSFormData,
  yPos: number
): Promise<number> {
  const headerColor = '#edeaea';
  const cellBackgroundColor = '#f7f7f7';
  const borderColor = [211, 211, 211];

  // Welfare
  (doc as any).autoTable({
    startY: yPos,
    head: [['WELFARE']],
    body: [[rams.welfare_first_aid]],
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

  // First Aid
  (doc as any).autoTable({
    startY: yPos,
    head: [['FIRST AID']],
    body: [[rams.nearest_hospital]],
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

  // Fire Action Plan
  (doc as any).autoTable({
    startY: yPos,
    head: [['FIRE ACTION PLAN']],
    body: [[rams.fire_action_plan]],
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

  // Protection of Public
  (doc as any).autoTable({
    startY: yPos,
    head: [['PROTECTION OF PUBLIC']],
    body: [[rams.protection_of_public]],
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

  // Clean Up
  (doc as any).autoTable({
    startY: yPos,
    head: [['CLEAN UP']],
    body: [[rams.clean_up]],
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