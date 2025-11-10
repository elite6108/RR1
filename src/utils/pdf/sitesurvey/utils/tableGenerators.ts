import jsPDF from 'jspdf';
import type { CompanySettings } from '../../../../types/database';
import type { SiteSurvey } from '../types';
import { fieldLabels, pdfStyles, layoutConstants, columnStyles, enclosureDescriptions } from './constants';

/**
 * Generates the company information table
 */
export function generateCompanyInfoTable(
  doc: jsPDF,
  companySettings: CompanySettings,
  yPos: number
): void {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = layoutConstants.leftColumnX;
  const rightColumnX = pageWidth / 2 + layoutConstants.rightColumnXOffset;
  const boxWidth = pageWidth / 2 - layoutConstants.boxWidthOffset;

  (doc as any).autoTable({
    startY: yPos,
    head: [['COMPANY INFORMATION']],
    body: [
      [{
        content: [
          { text: companySettings.name, styles: { fontStyle: 'bold' } },
          { text: '\n' + companySettings.address_line1 },
          { text: companySettings.address_line2 ? '\n' + companySettings.address_line2 : '' },
          { text: `\n${companySettings.town}, ${companySettings.county}` },
          { text: '\n' + companySettings.post_code },
          { text: '\n\n'+ companySettings.phone },
          { text: '\n' + companySettings.email }
        ].map(item => item.text).join(''),
        styles: { cellWidth: 'auto', halign: 'left' }
      }]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: pdfStyles.headerColor,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: pdfStyles.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    margin: { left: leftColumnX, right: rightColumnX },
    tableWidth: boxWidth
  });
}

/**
 * Generates the site survey details table
 */
export function generateSiteSurveyDetailsTable(
  doc: jsPDF,
  surveyData: SiteSurvey,
  yPos: number
): void {
  const pageWidth = doc.internal.pageSize.width;
  const rightColumnX = pageWidth / 2 + layoutConstants.rightColumnXOffset;
  const boxWidth = pageWidth / 2 - layoutConstants.boxWidthOffset;

  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: 'SITE SURVEY DETAILS', colSpan: 2 }]],
    body: [
      [{ content: fieldLabels.customer, styles: { fontStyle: 'bold' } }, 
       surveyData.customer?.company_name || surveyData.customer?.customer_name || 'N/A'],
      [{ content: fieldLabels.project, styles: { fontStyle: 'bold' } }, 
       surveyData.project?.name || 'N/A'],
      [{ content: fieldLabels.fullAddress, styles: { fontStyle: 'bold' } }, 
       surveyData.full_address || 'N/A'],
      [{ content: fieldLabels.what3words, styles: { fontStyle: 'bold' } }, 
       surveyData.location_what3words || 'N/A'],
      [{ content: fieldLabels.siteContact, styles: { fontStyle: 'bold' } }, 
       surveyData.site_contact || 'N/A']
    ],
    theme: 'grid',
    headStyles: {
      fillColor: pdfStyles.headerColor,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      fillColor: pdfStyles.cellBackgroundColor,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    columnStyles: { 
      0: { cellWidth: boxWidth * 0.4 },
      1: { cellWidth: boxWidth * 0.6 }
    },
    margin: { left: rightColumnX, right: 15 },
    tableWidth: boxWidth
  });
}

/**
 * Generates the site access section table
 */
export function generateSiteAccessTable(
  doc: jsPDF,
  surveyData: SiteSurvey,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'SITE ACCESS',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [
      [
        {
          content: fieldLabels.siteAccessDescription,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.site_access_description || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.suitableForLorry,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.suitable_for_lorry ? 'Yes' : 'No',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ]
    ],
    headStyles: {
      fontStyle: 'bold'
    },
    columnStyles: columnStyles.standard,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Generates the site access images header table
 */
export function generateSiteAccessImagesHeader(
  doc: jsPDF,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'SITE ACCESS IMAGES',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [],
    headStyles: {
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 5;
}

/**
 * Generates the site access videos table
 */
export function generateSiteAccessVideosTable(
  doc: jsPDF,
  surveyData: SiteSurvey,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'SITE ACCESS VIDEOS',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [
      [
        {
          content: 'Site Access Videos:',
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: (surveyData.site_access_videos && Array.isArray(surveyData.site_access_videos) && surveyData.site_access_videos.length > 0) 
            ? 'Video is in the CRM' 
            : 'No Video Added',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ]
    ],
    headStyles: {
      fontStyle: 'bold'
    },
    columnStyles: columnStyles.standard,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Generates the land section table
 */
export function generateLandTable(
  doc: jsPDF,
  surveyData: SiteSurvey,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'LAND',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [
      [
        {
          content: fieldLabels.waterHandling,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.water_handling || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.manholesDescription,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.manholes_description || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.servicesPresent,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.services_present ? 'Yes' : 'No',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.servicesDescription,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.services_description || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ]
    ],
    headStyles: {
      fontStyle: 'bold'
    },
    columnStyles: columnStyles.standard,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Generates the services images header table
 */
export function generateServicesImagesHeader(
  doc: jsPDF,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'SERVICES IMAGES',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [],
    headStyles: {
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 5;
}

/**
 * Generates the work required section table
 */
export function generateWorkRequiredTable(
  doc: jsPDF,
  surveyData: SiteSurvey,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'WORK REQUIRED',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [
      [
        {
          content: fieldLabels.numberOfCourts,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.number_of_courts?.toString() || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.shutteringRequired,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.shuttering_required ? 'Yes' : 'No',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.tarmacRequired,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.tarmac_required ? 'Yes' : 'No',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.tarmacLocation,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.tarmac_location || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.tarmacWagonSpace,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.tarmac_wagon_space || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.muckawayRequired,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.muckaway_required || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.surfaceType,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.surface_type || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.lightingRequired,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.lighting_required ? 'Yes' : 'No',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.lightingDescription,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.lighting_description || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.canopiesRequired,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.canopies_required ? 'Yes' : 'No',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.numberOfCanopies,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.number_of_canopies?.toString() || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ]
    ],
    headStyles: {
      fontStyle: 'bold'
    },
    columnStyles: columnStyles.standard,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Generates the court features section table
 */
export function generateCourtFeaturesTable(
  doc: jsPDF,
  surveyData: SiteSurvey,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'COURT FEATURES',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [
      [
        {
          content: fieldLabels.courtDimensions,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.court_dimensions || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.courtHeight,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.court_height ? `${surveyData.court_height}m` : 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.courtEnclosureType,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.court_enclosure_type || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.courtFloorMaterial,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.court_floor_material || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ],
      [
        {
          content: fieldLabels.courtFeatures,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: surveyData.court_features || 'N/A',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ]
    ],
    headStyles: {
      fontStyle: 'bold'
    },
    columnStyles: columnStyles.standard,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 10;
}

/**
 * Generates the enclosure type details table if applicable
 */
export function generateEnclosureTypeDetails(
  doc: jsPDF,
  enclosureType: string,
  yPos: number
): number {
  const description = enclosureDescriptions[enclosureType as keyof typeof enclosureDescriptions];
  
  if (description) {
    (doc as any).autoTable({
      startY: yPos,
      head: [['ENCLOSURE TYPE DETAILS']],
      body: [[description]],
      headStyles: {
        fillColor: pdfStyles.headerColor,
        textColor: '#000000',
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: pdfStyles.cellBackgroundColor
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.1,
        lineColor: pdfStyles.borderColor
      },
      theme: 'plain',
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 'auto' }
      }
    });

    return (doc as any).lastAutoTable.finalY + 10;
  }
  
  return yPos;
}

/**
 * Generates the drawings & plans header table
 */
export function generateDrawingsPlansHeader(
  doc: jsPDF,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'DRAWINGS & PLANS',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [],
    headStyles: {
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY + 5;
}

/**
 * Generates the drawings & plans videos table
 */
export function generateDrawingsVideosTable(
  doc: jsPDF,
  surveyData: SiteSurvey,
  yPos: number
): number {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'DRAWINGS & PLANS VIDEOS',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [
      [
        {
          content: 'Drawings & Plans Videos:',
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: (surveyData.drawings_videos && Array.isArray(surveyData.drawings_videos) && surveyData.drawings_videos.length > 0) 
            ? 'Video is in the CRM' 
            : 'No Video Added',
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ]
    ],
    headStyles: {
      fontStyle: 'bold'
    },
    columnStyles: columnStyles.standard,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });

  return (doc as any).lastAutoTable.finalY;
}

/**
 * Generates the notes/comments section table
 */
export function generateNotesCommentsTable(
  doc: jsPDF,
  notesComments: string,
  yPos: number
): void {
  (doc as any).autoTable({
    startY: yPos,
    head: [
      [{
        content: 'NOTES/COMMENTS',
        colSpan: 6,
        styles: {
          fillColor: pdfStyles.headerColor,
          textColor: 'black',
          fontStyle: 'bold'
        }
      }]
    ],
    body: [
      [
        {
          content: fieldLabels.notesComments,
          colSpan: 2,
          styles: {
            fontStyle: 'bold',
            fillColor: '#EDEDED'
          }
        },
        {
          content: notesComments,
          colSpan: 4,
          styles: {
            fillColor: '#ffffff'
          }
        }
      ]
    ],
    headStyles: {
      fontStyle: 'bold'
    },
    columnStyles: columnStyles.standard,
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineWidth: 0.1,
      lineColor: pdfStyles.borderColor
    },
    theme: 'grid',
    margin: { left: 15, right: 15 }
  });
}
