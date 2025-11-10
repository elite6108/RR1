import { jsPDF } from 'jspdf';
import type { PDFTheme } from '../types';

export const getPDFTheme = (): PDFTheme => ({
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  borderColor: [211, 211, 211], // Light gray border
});

export const initializePDF = (): jsPDF => {
  const doc = new jsPDF();
  doc.setFont('helvetica');
  return doc;
};

export const getPDFDimensions = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15; // Left margin
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing
  
  return {
    pageWidth,
    leftColumnX,
    rightColumnX,
    boxWidth,
  };
};

export const addPDFTitle = (doc: jsPDF, title: string, themeColor: string): void => {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(themeColor);
  doc.text(title, 195, 25, { align: 'right' });
  
  // Reset text color and font
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
};
