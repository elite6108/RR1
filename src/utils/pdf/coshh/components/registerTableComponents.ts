import { CoshhSubstance, PDFStyles } from '../types';
import { formatDate } from '../utils/dataHelpers';

// Create the main substances table for the register
export const createSubstancesTable = (
  doc: any,
  substances: CoshhSubstance[],
  styles: PDFStyles,
  yPos: number,
  leftColumnX: number,
  pageWidth: number
): void => {
  (doc as any).autoTable({
    startY: yPos,
    head: [['SUBSTANCE NAME', 'MANUFACTURER', 'CATEGORY', 'STORAGE LOCATION', 'HAZARD SHEET LOCATION', 'DATE ADDED', 'REVIEWED ON', 'NEXT REVIEW']],
    body: substances.map(substance => [
      substance.substance_name,
      substance.manufacturer,
      substance.category,
      substance.storage_location,
      substance.hazard_sheet_location,
      formatDate(substance.added_date),
      formatDate(substance.reviewed_date),
      formatDate(substance.review_date)
    ]),
    headStyles: {
      fillColor: styles.headerColor,
      textColor: styles.themeColor,
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 2,
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Substance Name
      1: { cellWidth: 36 }, // Manufacturer
      2: { cellWidth: 42 }, // Category
      3: { cellWidth: 34 }, // Storage Location
      4: { cellWidth: 40 }, // Hazard Sheet Location
      5: { cellWidth: 25 }, // Date Added
      6: { cellWidth: 25 }, // Reviewed On
      7: { cellWidth: 25 }  // Next Review
    },
    bodyStyles: {
      fillColor: styles.cellBackgroundColor,
      fontSize: 8,
      cellPadding: 2
    },
    alternateRowStyles: {
      fillColor: '#ffffff'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineWidth: 0.1,
      lineColor: styles.borderColor,
      overflow: 'linebreak',
      cellWidth: 'wrap',
      halign: 'left'
    },
    theme: 'grid',
    margin: { left: leftColumnX, right: 15 },
    tableWidth: pageWidth - leftColumnX - 15
  });
};

// Create category breakdown table
export const createCategoryBreakdownTable = (
  doc: any,
  substances: CoshhSubstance[],
  styles: PDFStyles,
  yPos: number
): void => {
  // Category breakdown
  const categoryCount = substances.reduce((acc, substance) => {
    acc[substance.category] = (acc[substance.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCount).map(([category, count]) => [
    category,
    count.toString()
  ]);

  (doc as any).autoTable({
    startY: yPos,
    head: [['CATEGORY BREAKDOWN', 'COUNT']],
    body: categoryData,
    headStyles: {
      fillColor: styles.headerColor,
      textColor: styles.themeColor,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fillColor: styles.cellBackgroundColor
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: styles.borderColor
    },
    theme: 'plain',
    margin: { left: 15, right: 15 },
    tableWidth: 'auto'
  });
};
