import { CoshhAssessment, PDFStyles, TableCellWithImage } from '../types';
import { buildTableRow, formatDate } from '../utils/dataHelpers';
import { PPE_FILENAMES, HAZARD_FILENAMES } from '../utils/constants';
import { getSignedPPEImageUrl, getSignedHazardImageUrl, loadImageDataForPDF } from '../utils/imageHelpers';

// Create substance details table
export const createSubstanceDetailsTable = (
  doc: any,
  assessment: CoshhAssessment,
  personsAtRisk: string[],
  routesOfEntry: string[],
  styles: PDFStyles,
  yPos: number
): void => {
  const substanceDetailsData = [
    buildTableRow('Name of Substance', assessment.substance_name),
    buildTableRow('COSHH Reference', assessment.coshh_reference),
    buildTableRow('Supplied by', assessment.supplied_by),
    buildTableRow('Description of Substance', assessment.description_of_substance),
    buildTableRow('Form', assessment.form),
    buildTableRow('Odour', assessment.odour),
    buildTableRow('Method of Use', assessment.method_of_use),
    buildTableRow('Site and Location', assessment.site_and_location),
    buildTableRow('Persons at Risk', personsAtRisk.join(', ')),
    buildTableRow('Routes of Entry', routesOfEntry.join(', '))
  ];

  (doc as any).autoTable({
    startY: yPos,
    head: [['SUBSTANCE DETAILS', '']],
    body: substanceDetailsData,
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
      lineColor: styles.borderColor,
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 130 }
    },
    theme: 'grid',
    margin: { left: 15, right: 15 },
    tableWidth: 180
  });
};

// Create chemical properties table
export const createChemicalPropertiesTable = (
  doc: any,
  assessment: CoshhAssessment,
  styles: PDFStyles,
  yPos: number
): void => {
  const chemicalPropertiesData = [];
  if (assessment.carcinogen !== undefined) {
    chemicalPropertiesData.push(buildTableRow('Carcinogen', assessment.carcinogen ? 'Yes' : 'No'));
  }
  if (assessment.sk !== undefined) {
    chemicalPropertiesData.push(buildTableRow('Sk (Skin Notation)', assessment.sk ? 'Yes' : 'No'));
  }
  if (assessment.sen !== undefined) {
    chemicalPropertiesData.push(buildTableRow('Sen (Sensitiser)', assessment.sen ? 'Yes' : 'No'));
  }

  if (chemicalPropertiesData.length > 0) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['CHEMICAL PROPERTIES', '']],
      body: chemicalPropertiesData,
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};

// Create ingredient items table
export const createIngredientItemsTable = (
  doc: any,
  ingredientItems: Array<{ingredient_name: string; wel_twa_8_hrs: string; stel_15_mins: string}>,
  styles: PDFStyles,
  yPos: number
): void => {
  if (ingredientItems.length > 0) {
    const ingredientTableData = ingredientItems.map(item => [
      item.ingredient_name || 'N/A',
      item.wel_twa_8_hrs || 'N/A',
      item.stel_15_mins || 'N/A'
    ]);

    (doc as any).autoTable({
      startY: yPos,
      head: [['INGREDIENT NAME', 'WEL TWA 8 HRS', 'STEL (15 MINS)']],
      body: ingredientTableData,
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: styles.cellBackgroundColor
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        halign: 'left'
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};

// Create PPE requirements table with images
export const createPPERequirementsTable = async (
  doc: any,
  selectedPPE: string[],
  styles: PDFStyles,
  yPos: number
): Promise<void> => {
  if (selectedPPE.length > 0) {
    console.log('Creating PPE Requirements section with images...');
    const maxColumns = 4;
    const tableBody = [];

    // Process PPE items in groups of 4
    for (let i = 0; i < selectedPPE.length; i += maxColumns) {
      const rowItems = selectedPPE.slice(i, i + maxColumns);
      const row = await Promise.all(rowItems.map(async (item: string) => {
        const filename = PPE_FILENAMES[item];
        if (!filename) {
          console.warn(`No filename found for PPE item: ${item} - displaying text only`);
          return {
            content: item,
            styles: {
              fillColor: styles.cellBackgroundColor,
              halign: 'center',
              valign: 'middle',
              cellPadding: 5,
              cellWidth: 180 / maxColumns,
              fontSize: 9
            }
          };
        }

        try {
          const signedUrl = await getSignedPPEImageUrl(filename);
          if (!signedUrl) {
            console.warn(`Failed to get signed URL for PPE item: ${item} - displaying text only`);
            return {
              content: item,
              styles: {
                fillColor: styles.cellBackgroundColor,
                halign: 'center',
                valign: 'middle',
                cellPadding: 5,
                cellWidth: 180 / maxColumns,
                fontSize: 9
              }
            };
          }

          const imageData = await loadImageDataForPDF(signedUrl);
          if (!imageData) {
            throw new Error('Failed to load image data');
          }

          return {
            content: `\n\n\n${item}`,
            styles: {
              fillColor: styles.cellBackgroundColor,
              halign: 'center',
              valign: 'middle',
              cellPadding: { top: 25, bottom: 5, left: 3, right: 3 },
              cellWidth: 180 / maxColumns,
              fontSize: 9
            },
            image: imageData,
            imageOptions: {
              imageData,
              x: 0,
              y: 0,
              width: 20,
              height: 20
            }
          };
        } catch (error) {
          console.warn(`Error loading PPE image for ${item}: ${error instanceof Error ? error.message : 'Unknown error'} - displaying text only`);
          return {
            content: item,
            styles: {
              fillColor: styles.cellBackgroundColor,
              halign: 'center',
              valign: 'middle',
              cellPadding: 5,
              cellWidth: 180 / maxColumns,
              fontSize: 9
            }
          };
        }
      }));

      // Pad the row with empty cells if needed
      while (row.length < maxColumns) {
        row.push({
          content: '',
          styles: {
            fillColor: styles.cellBackgroundColor,
            halign: 'center',
            valign: 'middle',
            cellPadding: 5,
            cellWidth: 180 / maxColumns
          }
        });
      }

      tableBody.push(row);
    }

    (doc as any).autoTable({
      startY: yPos,
      head: [[{ content: 'REQUIRED PPE', colSpan: maxColumns, styles: { halign: 'LEFT' } }]],
      body: tableBody,
      didDrawCell: function(data: any) {
        if (data.cell.raw.image && data.cell.raw.imageOptions) {
          const cell = data.cell;
          const opts = cell.raw.imageOptions;
          const x = cell.x + (cell.width - opts.width) / 2;
          const y = cell.y + 5;
          try {
            doc.addImage(opts.imageData, 'PNG', x, y, opts.width, opts.height);
          } catch (error) {
            console.warn(`Failed to add PPE image to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      },
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold',
        cellPadding: 3,
        minCellHeight: 12,
      },
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        minCellHeight: 40,
        cellWidth: 180 / maxColumns
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};

// Create hazards table with images
export const createHazardsTable = async (
  doc: any,
  selectedHazards: string[],
  styles: PDFStyles,
  yPos: number
): Promise<void> => {
  if (selectedHazards.length > 0) {
    console.log('Creating Hazards section with images...');
    const maxColumns = 4;
    const tableBody = [];

    // Process Hazard items in groups of 4
    for (let i = 0; i < selectedHazards.length; i += maxColumns) {
      const rowItems = selectedHazards.slice(i, i + maxColumns);
      const row = await Promise.all(rowItems.map(async (item: string) => {
        const filename = HAZARD_FILENAMES[item];
        if (!filename) {
          console.warn(`No filename found for Hazard item: ${item} - displaying text only`);
          return {
            content: item,
            styles: {
              fillColor: styles.cellBackgroundColor,
              halign: 'center',
              valign: 'middle',
              cellPadding: 5,
              cellWidth: 180 / maxColumns,
              fontSize: 9
            }
          };
        }

        try {
          const signedUrl = await getSignedHazardImageUrl(filename);
          if (!signedUrl) {
            console.warn(`Failed to get signed URL for Hazard item: ${item} - displaying text only`);
            return {
              content: item,
              styles: {
                fillColor: styles.cellBackgroundColor,
                halign: 'center',
                valign: 'middle',
                cellPadding: 5,
                cellWidth: 180 / maxColumns,
                fontSize: 9
              }
            };
          }

          const imageData = await loadImageDataForPDF(signedUrl);
          if (!imageData) {
            throw new Error('Failed to load image data');
          }

          return {
            content: `\n\n\n${item}`,
            styles: {
              fillColor: styles.cellBackgroundColor,
              halign: 'center',
              valign: 'middle',
              cellPadding: { top: 25, bottom: 5, left: 3, right: 3 },
              cellWidth: 180 / maxColumns,
              fontSize: 9
            },
            image: imageData,
            imageOptions: {
              imageData,
              x: 0,
              y: 0,
              width: 20,
              height: 20
            }
          };
        } catch (error) {
          console.warn(`Error loading Hazard image for ${item}: ${error instanceof Error ? error.message : 'Unknown error'} - displaying text only`);
          return {
            content: item,
            styles: {
              fillColor: styles.cellBackgroundColor,
              halign: 'center',
              valign: 'middle',
              cellPadding: 5,
              cellWidth: 180 / maxColumns,
              fontSize: 9
            }
          };
        }
      }));

      // Pad the row with empty cells if needed
      while (row.length < maxColumns) {
        row.push({
          content: '',
          styles: {
            fillColor: styles.cellBackgroundColor,
            halign: 'center',
            valign: 'middle',
            cellPadding: 5,
            cellWidth: 180 / maxColumns
          }
        });
      }

      tableBody.push(row);
    }

    (doc as any).autoTable({
      startY: yPos,
      head: [[{ content: 'IDENTIFIED HAZARDS', colSpan: maxColumns, styles: { halign: 'LEFT' } }]],
      body: tableBody,
      didDrawCell: function(data: any) {
        if (data.cell.raw.image && data.cell.raw.imageOptions) {
          const cell = data.cell;
          const opts = cell.raw.imageOptions;
          const x = cell.x + (cell.width - opts.width) / 2;
          const y = cell.y + 5;
          try {
            doc.addImage(opts.imageData, 'PNG', x, y, opts.width, opts.height);
          } catch (error) {
            console.warn(`Failed to add Hazard image to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      },
      headStyles: {
        fillColor: styles.headerColor,
        textColor: styles.themeColor,
        fontStyle: 'bold',
        cellPadding: 3,
        minCellHeight: 12,
      },
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: styles.borderColor,
        minCellHeight: 40,
        cellWidth: 180 / maxColumns
      },
      theme: 'grid',
      margin: { left: 15, right: 15 },
      tableWidth: 180
    });
  }
};
