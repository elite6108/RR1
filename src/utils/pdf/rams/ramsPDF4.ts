import { jsPDF } from 'jspdf';
import type { RAMSFormData } from '../../../types/rams';
import { supabase } from '../../../lib/supabase';

const PRIORITY_PPE = [
  'Face Shield',
  'Hard Hat',
  'Hearing Protection',
  'Hi Vis Clothing',
  'P3 Masks',
  'Protective Clothing',
  'Respirator Hoods',
  'Safety Footwear',
  'Safety Gloves',
  'Safety Goggles',
];

const OTHER_PPE = [
  'Connect an earth terminal to the ground',
  'Disconnect before carrying out maintenance or repair',
  'Disconnect mains plug from electrical outlet',
  'Disinfect surface',
  'Disinfect your hands',
  'Ensure continuous ventilation',
  'Entry only with supervisor outside',
  'General mandatory action sign',
  'Install locks and keep locked',
  'Install or check guard',
  'Opaque eye protection must be worn',
  'Place trash in the bin',
  'Refer to instruction manual',
  'Secure gas cylinders',
  'Sound your horn',
  'Use barrier cream',
  'Use breathing equipment',
  'Use footbridge',
  'Use footwear with antistatic or antispark features',
  'Use gas detector',
  'Use guard to protect from injury from the table saw',
  'Use handrail',
  'Use protective apron',
  'Use this walkway',
  'Ventilate before and during entering',
  'Wash your hands',
  'Wear a safety harness',
  'Wear a welding mask',
  'Wear safety belts',
];

// Map of PPE names to their filenames
const PPE_FILENAMES = {
  'Safety Gloves': 'wear-protective-gloves.png',
  'Safety Footwear': 'wear-foot-protection.png',
  'Hi Vis Clothing': 'wear-high-visibility-clothing.png',
  'Hard Hat': 'wear-head-protection.png',
  'Safety Goggles': 'wear-eye-protection.png',
  'Hearing Protection': 'wear-ear-protection.png',
  'Protective Clothing': 'wear-protective-clothing.png',
  'P3 Masks': 'wear-a-mask.png',
  'Face Shield': 'wear-a-face-shield.png',
  'Respirator Hoods': 'wear-respiratory-protection.png',
  'Connect an earth terminal to the ground':
    'connect-an-earth-terminal-to-the-ground.png',
  'Disconnect before carrying out maintenance or repair':
    'disconnect-before-carrying-out-maintenance-or-repair.png',
  'Disconnect mains plug from electrical outlet':
    'disconnect-mains-plug-from-electrical-outlet.png',
  'Disinfect surface': 'disinfect-surface.png',
  'Disinfect your hands': 'disinfect-your-hands.png',
  'Ensure continuous ventilation': 'ensure-continuous-ventilation.png',
  'Entry only with supervisor outside':
    'entry-only-with-supervisor-outside.png',
  'General mandatory action sign': 'general-mandatory-action-sign.png',
  'Install locks and keep locked': 'install-locks-and-keep-locked.png',
  'Install or check guard': 'install-or-check-guard.png',
  'Opaque eye protection must be worn':
    'opaque-eye-protection-must-be-worn.png',
  'Place trash in the bin': 'place-trash-in-the-bin.png',
  'Refer to instruction manual': 'refer-to-instruction-manual.png',
  'Secure gas cylinders': 'secure-gas-cylinders.png',
  'Sound your horn': 'sound-your-horn.png',
  'Use barrier cream': 'use-barrier-cream.png',
  'Use breathing equipment': 'use-breathing-equipment.png',
  'Use footbridge': 'use-footbridge.png',
  'Use footwear with antistatic or antispark features':
    'use-footwear-with-anti-static-or-anti-spark-features.png',
  'Use gas detector': 'use-gas-detector.png',
  'Use guard to protect from injury from the table saw':
    'use-guard-to-protect-from-injury-from-the-table-saw.png',
  'Use handrail': 'use-handrail.png',
  'Use protective apron': 'use-protective-apron.png',
  'Use this walkway': 'use-this-walkway.png',
  'Ventilate before and during entering':
    'ventilate-before-and-during-entering.png',
  'Wash your hands': 'wash-your-hands.png',
  'Wear a safety harness': 'wear-a-safety-harness.png',
  'Wear a welding mask': 'wear-a-welding-mask.png',
  'Wear safety belts': 'wear-safety-belts.png',
};

// Function to get a signed URL for a PPE icon
const getSignedImageUrl = async (filename: string) => {
  if (!filename) return null;

  try {
    const { data } = await supabase.storage
      .from('ppe-icons')
      .createSignedUrl(filename, 3600);

    return data?.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

export async function generateRAMSPDF4(
  doc: jsPDF,
  rams: RAMSFormData,
  yPos: number
): Promise<number> {
  const headerColor = '#edeaea';
  const cellBackgroundColor = '#f7f7f7';
  const borderColor = [211, 211, 211];
  const pageWidth = doc.internal.pageSize.width;

  if (rams.ppe && rams.ppe.length > 0) {
    const maxColumns = 4;
    const priorityPPE = rams.ppe.filter((item) => PRIORITY_PPE.includes(item));
    const otherPPE = rams.ppe.filter((item) => OTHER_PPE.includes(item));
    const allPPE = [...priorityPPE, ...otherPPE];
    const tableBody = [];

    // Process PPE items in groups of 4
    for (let i = 0; i < allPPE.length; i += maxColumns) {
      const rowItems = allPPE.slice(i, i + maxColumns);
      const row = await Promise.all(
        rowItems.map(async (item) => {
          const filename = PPE_FILENAMES[item as keyof typeof PPE_FILENAMES];
          if (!filename) {
            console.error(`No filename found for PPE item: ${item}`);
            return {
              content: item,
              styles: {
                fillColor: cellBackgroundColor,
                halign: 'center',
                valign: 'middle',
                cellPadding: 5,
                cellWidth: (pageWidth - 30) / maxColumns,
              },
            };
          }

          try {
            const signedUrl = await getSignedImageUrl(filename);
            if (!signedUrl) throw new Error('Failed to get signed URL');

            const response = await fetch(signedUrl);
            if (!response.ok)
              throw new Error(`Failed to fetch image: ${response.statusText}`);

            const blob = await response.blob();
            const reader = new FileReader();
            const imageData = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            // Create cell with image and text
            return {
              content: `\n\n\n${item}`,
              styles: {
                fillColor: cellBackgroundColor,
                halign: 'center',
                valign: 'middle',
                cellPadding: { top: 25, bottom: 5, left: 3, right: 3 },
                cellWidth: (pageWidth - 30) / maxColumns,
              },
              image: imageData,
              imageOptions: {
                imageData,
                x: 0,
                y: 0,
                width: 20,
                height: 20,
              },
            };
          } catch (error) {
            console.error(`Error loading PPE image for ${item}:`, error);
            return {
              content: item,
              styles: {
                fillColor: cellBackgroundColor,
                halign: 'center',
                valign: 'middle',
                cellPadding: 5,
                cellWidth: (pageWidth - 30) / maxColumns,
              },
            };
          }
        })
      );

      // Pad the row with empty cells if needed
      while (row.length < maxColumns) {
        row.push({
          content: '',
          styles: {
            fillColor: cellBackgroundColor,
            halign: 'center',
            valign: 'middle',
            cellPadding: 5,
            cellWidth: (pageWidth - 30) / maxColumns,
          },
        });
      }

      tableBody.push(row);
    }

    (doc as any).autoTable({
      startY: yPos,
      head: [
        [
          {
            content: 'PPE REQUIREMENTS',
            colSpan: maxColumns,
            styles: { halign: 'center' },
          },
        ],
      ],
      body: tableBody,
      didDrawCell: function (data: any) {
        if (data.cell.raw.image && data.cell.raw.imageOptions) {
          const cell = data.cell;
          const opts = cell.raw.imageOptions;
          const x = cell.x + (cell.width - opts.width) / 2;
          const y = cell.y + 5;
          doc.addImage(opts.imageData, 'PNG', x, y, opts.width, opts.height);
        }
      },
      headStyles: {
        fillColor: headerColor,
        textColor: '#000000',
        fontStyle: 'bold',
        cellPadding: 5,
        minCellHeight: 12,
      },
      styles: {
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: borderColor,
        minCellHeight: 40,
      },
      theme: 'plain',
      margin: { left: 15, right: 15 },
    });

    // Add PPE requirements text after the table
    yPos = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const ppeText = `The minimum PPE requirement for all work will be Safety Footwear (boots or shoes), high visibility vest or jacket with additional PPE comprising of:

Gloves to EN388 Abrasion, Blade Cut, Tear and Puncture

Safety headgear (helmet) – EN397

Safety goggles or glasses to BS EN 166/172 (particulate)

Dust inhalation protective masks to EN149 (If working Indoors)

Safety Gloves: To be used at all times on site when working.

Hard Hat: To be used when operating at heights or lifting

Hi Vis: To be worn when operating on site at all times

Safety Footwear: To be worn when operating on site at all times.

Wear a safety harness: To be worn when on scaffold towers, ladders, heights, genie lift or other lifting cranes.`;

    const textLines = doc.splitTextToSize(ppeText, pageWidth - 30);
    doc.text(textLines, 15, yPos);

    const textHeight = textLines.length * 5 + 10;
    yPos += textHeight;

    return yPos;
  }

  return yPos;
}
