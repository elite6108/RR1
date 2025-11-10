import { PDF_STYLES } from '../utils/constants';
import { createPPEItem } from '../utils/helpers';

export const generatePPESection = async (doc: any, ppe: string[], yPos: number): Promise<number> => {
  if (ppe.length === 0) return yPos;

  const { cellBackgroundColor, borderColor } = PDF_STYLES;
  const pageWidth = doc.internal.pageSize.width;
  const maxColumns = 4;
  const ppeItems = ppe;
  const tableBody = [];

  // Process PPE items in groups of 4
  for (let i = 0; i < ppeItems.length; i += maxColumns) {
    const rowItems = ppeItems.slice(i, i + maxColumns);
    const row = await Promise.all(rowItems.map(async (item: string) => {
      return await createPPEItem(item, pageWidth, maxColumns, cellBackgroundColor);
    }));

    // Pad the row with empty cells if needed
    while (row.length < maxColumns) {
      row.push({
        content: '',
        styles: {
          fillColor: cellBackgroundColor,
          halign: 'center',
          valign: 'middle',
          cellPadding: 5,
          cellWidth: (pageWidth - 30) / maxColumns
        }
      });
    }

    tableBody.push(row);
  }

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'PPE REQUIREMENTS', colSpan: maxColumns, styles: { halign: 'LEFT' } }]],
    body: tableBody,
    didDrawCell: function(data: any) {
      if (data.cell.raw.image && data.cell.raw.imageOptions) {
        const cell = data.cell;
        const opts = cell.raw.imageOptions;
        const x = cell.x + (cell.width - opts.width) / 2;
        const y = cell.y + 5;
        doc.addImage(opts.imageData, 'PNG', x, y, opts.width, opts.height);
      }
    },
    headStyles: {
      fillColor: '#edeaea',
      textColor: '#000000',
      fontStyle: 'bold',
      cellPadding: 3,
      minCellHeight: 12,
    },
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
      lineColor: borderColor,
      minCellHeight: 40,
      cellWidth: (pageWidth - 30) / maxColumns
    },
    theme: 'plain',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
};
