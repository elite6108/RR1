import jsPDF from 'jspdf';
import type { SectionConfig } from '../types';
import { formatSectionContent } from '../utils/formatters';

// Create two-column table for sections
export const createTwoColumnTable = (
  doc: jsPDF,
  section: SectionConfig,
  filteredData: any,
  yPos: number,
  headerColor: string,
  borderColor: [number, number, number]
): void => {
  const formattedContent = formatSectionContent(filteredData, section.title);
  const rows = formattedContent.split('\n\n').map(pair => {
    // Special handling for Hazard Identification
    if (section.title === 'Hazard Identification') {
      const [title, ...options] = pair.split('\n');
      const optionsList = options.join('\n').trim();
      return [
        { 
          content: title,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        },
        {
          content: optionsList,
          styles: {
            fillColor: '#ffffff',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        }
      ];
    }
    
    // Special handling for sections with bullet points
    if (section.title === 'Hours & Team' && pair.includes('Who are the key team members?')) {
      const [label, ...members] = pair.split('\n');
      const membersList = members.join('\n').trim();
      return [
        { 
          content: 'Who are the key team members?',
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        },
        {
          content: membersList,
          styles: {
            fillColor: '#ffffff',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        }
      ];
    }
    
    // Special handling for Site Rules PPE Requirements
    if (section.title === 'Site Rules' && pair.includes('PPE Requirements:')) {
      const [label, ...items] = pair.split('\n');
      const itemsList = items.join('\n').trim();
      return [
        { 
          content: 'PPE Requirements:',
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        },
        {
          content: itemsList,
          styles: {
            fillColor: '#ffffff',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        }
      ];
    }

    // Special handling for Site Rules Additional/General Rules
    if (section.title === 'Site Rules' && pair.includes('Additional/General Rules:')) {
      const [label, ...items] = pair.split('\n');
      const itemsList = items.join('\n').trim();
      return [
        { 
          content: 'Additional/General Rules:',
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        },
        {
          content: itemsList,
          styles: {
            fillColor: '#ffffff',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        }
      ];
    }

    // Special handling for Welfare Arrangements
    if (section.title === 'Welfare Arrangements' && pair.includes('Selected Welfare Arrangements:')) {
      const [label, ...items] = pair.split('\n');
      return [
        { 
          content: label,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        },
        {
          content: items.join('\n'),
          styles: {
            fillColor: '#ffffff',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        }
      ];
    }

    // Special handling for Notifiable Work
    if (section.title === 'Notifiable Work' && pair.includes('Select the Notifiable Work')) {
      const [label, ...items] = pair.split('\n');
      const itemsList = items.join('\n').trim();
      return [
        { 
          content: 'Select the Notifiable Work that will take place on your site:',
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        },
        {
          content: itemsList,
          styles: {
            fillColor: '#ffffff',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        }
      ];
    }

    // Special handling for High Risk Construction Work
    if (section.title === 'High Risk Construction Work' && pair.includes('|')) {
      const [label, items] = pair.split('|');
      return [
        { 
          content: label,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        },
        {
          content: items,
          styles: {
            fillColor: '#ffffff',
            cellWidth: (doc.internal.pageSize.width - 30) / 2,
            cellPadding: 3
          }
        }
      ];
    }

    // Default handling for other content
    const [label, ...valueParts] = pair.split('\n');
    return [
      { 
        content: label,
        styles: {
          fontStyle: 'bold',
          fillColor: '#EDEDED',
          cellWidth: (doc.internal.pageSize.width - 30) / 2,
          cellPadding: 3
        }
      },
      {
        content: valueParts.join('\n'),
        styles: {
          fillColor: '#ffffff',
          cellWidth: (doc.internal.pageSize.width - 30) / 2,
          cellPadding: 3
        }
      }
    ];
  });

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ 
      content: section.title,
      colSpan: 2,
      styles: { 
        fillColor: headerColor,
        textColor: '#000000',
        halign: 'left',
        fontStyle: 'bold',
        cellPadding: 3,
        fontSize: 12
      }
    }]],
    body: rows,
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
      lineColor: borderColor,
      overflow: 'linebreak',
      cellPadding: 3
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });
};

// Create single-column table for sections
export const createSingleColumnTable = (
  doc: jsPDF,
  section: SectionConfig,
  filteredData: any,
  yPos: number,
  headerColor: string,
  cellBackgroundColor: string,
  borderColor: [number, number, number]
): void => {
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ 
      content: section.title,
      styles: { 
        fillColor: headerColor,
        textColor: '#000000',
        halign: 'left',
        fontStyle: 'bold',
        cellPadding: 3,
        fontSize: 12
      }
    }]],
    body: [[{ 
      content: formatSectionContent(filteredData, section.title),
      styles: { 
        fillColor: cellBackgroundColor,
        cellPadding: 3,
        lineHeight: 1.5,
        cellWidth: 'auto',
        halign: 'left',
        valign: 'top',
        fontSize: 10
      }
    }]],
    styles: {
      fontSize: 10,
      lineWidth: 0.1,
      lineColor: borderColor,
      overflow: 'linebreak'
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });
};
