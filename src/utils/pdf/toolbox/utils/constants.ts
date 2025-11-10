import type { PDFTheme, PDFDimensions } from '../types';

// PDF Theme Configuration
export const PDF_THEME: PDFTheme = {
  themeColor: '#000000',
  headerColor: '#edeaea',
  cellBackgroundColor: '#f7f7f7',
  detailsHeaderColor: '#edeaea',
  borderColor: [211, 211, 211] // Light gray border
};

// PDF Layout Constants
export const PDF_LAYOUT = {
  margins: {
    left: 15,
    right: 15,
    top: 15,
    bottom: 10
  },
  logo: {
    maxWidth: 40,
    maxHeight: 20,
    defaultAspectRatio: 300/91,
    x: 15,
    y: 15
  },
  title: {
    fontSize: 20,
    x: 195,
    y: 25
  },
  body: {
    fontSize: 10,
    startY: 45,
    spacing: 10
  },
  footer: {
    fontSize: 9,
    bottomMargin: 10
  }
};

// PDF Styling Constants
export const PDF_STYLES = {
  font: {
    family: 'helvetica',
    normal: 'normal',
    bold: 'bold'
  },
  table: {
    cellPadding: 3,
    lineWidth: 0.1,
    fontSize: 10
  }
};

// Helper function to calculate PDF dimensions
export function calculatePDFDimensions(pageWidth: number): PDFDimensions {
  const leftColumnX = PDF_LAYOUT.margins.left;
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

  return {
    pageWidth,
    leftColumnX,
    rightColumnX,
    boxWidth
  };
}
