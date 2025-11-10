import { jsPDF } from 'jspdf';
import type { RAMSFormData } from '../../../types/rams';

export async function generateRAMSPDF6(
  doc: jsPDF,
  rams: RAMSFormData,
  yPos: number
): Promise<number> {
  const headerColor = '#edeaea';
  const cellBackgroundColor = '#f7f7f7';
  const borderColor = [211, 211, 211];

  
  // Order of Works - Safety
  (doc as any).autoTable({
    startY: yPos,
    head: [['ORDER OF WORKS - SAFETY']],
    body: [[rams.order_of_works_safety]],
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

  // Delivery
  if (rams.delivery_info) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['DELIVERY']],
      body: [[rams.delivery_info]],
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
  }

  // Groundworks
  if (rams.order_of_works_task === 'groundworks') {
    (doc as any).autoTable({
      startY: yPos,
      head: [['GROUNDWORKS']],
      body: [[rams.groundworks_info]],
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
  }

  // Custom Works
  if (rams.order_of_works_task === 'custom' && rams.order_of_works_custom) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['CUSTOM WORKS']],
      body: [[rams.order_of_works_custom]],
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
  } else {
    (doc as any).autoTable({
      startY: yPos,
      head: [['CUSTOM WORKS']],
      body: [[rams.order_of_works_custom]],
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
  }

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Additional Information
  if (rams.additional_info) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['ADDITIONAL INFORMATION']],
      body: [[rams.additional_info]],
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
  }

  return (doc as any).lastAutoTable.finalY + 10;
}