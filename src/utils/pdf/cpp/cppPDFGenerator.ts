import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions, HazardData } from './types';
import { getSections, twoColumnSections } from './utils/sections';
import {
  addCompanyLogo,
  addTitle,
  createCompanyInfoTable,
  createCPPDetailsTable,
  createHazardsTables,
  createTwoColumnTable,
  createSingleColumnTable,
  addPageFooters
} from './components';

export async function generateCPPPDF({
  cpp,
  companySettings
}: GeneratePDFOptions): Promise<string> {
  try {
    console.log('Starting PDF generation with CPP data:', cpp);
    console.log('Contractors data:', cpp.contractors);

    // Create new PDF document
    const doc = new jsPDF();
    
    // Define theme colors and styles
    const themeColor = '#000000';
    const headerColor = '#edeaea';
    const cellBackgroundColor = '#f7f7f7';
    const borderColor: [number, number, number] = [211, 211, 211]; // Light gray border
    
    // Set default font
    doc.setFont('helvetica');

    // Add company logo if exists
    await addCompanyLogo(doc, companySettings);

    // Add title
    addTitle(doc, themeColor);

    let yPos = 45;
    const pageWidth = doc.internal.pageSize.width;
    const leftColumnX = 15;
    const rightColumnX = pageWidth / 2 + 5;
    const boxWidth = pageWidth / 2 - 20;

    // Create company information table
    createCompanyInfoTable(doc, companySettings, yPos, leftColumnX, boxWidth, cellBackgroundColor, borderColor);

    // Create CPP details table
    createCPPDetailsTable(doc, cpp, yPos, rightColumnX, boxWidth, cellBackgroundColor, borderColor);

    yPos = (doc as any).lastAutoTable.finalY + 20;

    // Get sections configuration
    const sections = getSections(cpp);

    console.log('About to process sections. Total sections:', sections.length);

    // Process each section
    for (const section of sections) {
      if (!section.data) {
        console.log(`Skipping section ${section.title} - no data`);
        continue;
      }

      // Special handling for Hazards section
      if (section.title === 'Hazards') {
        yPos = createHazardsTables(doc, section.data as HazardData | HazardData[], yPos, borderColor);
        continue; // Skip the regular table processing
      }

      // Check if any field in the section has data
      const hasData = section.fields.some(field => {
        const value = section.data[field];
        if (section.title === 'Contractors' && Array.isArray(section.data)) {
          return section.data.length > 0;
        }
        return value !== null && value !== undefined && 
               ((Array.isArray(value) && value.length > 0) || 
                (typeof value === 'object' && Object.keys(value).length > 0) ||
                (typeof value === 'string' && value.trim() !== '') ||
                (typeof value === 'boolean') ||
                (typeof value === 'number'));
      });

      if (!hasData) {
        console.log(`Skipping section ${section.title} - no valid data`);
        continue;
      }

      console.log(`Processing section: ${section.title}`);

      // Filter out empty fields before formatting
      const filteredData = section.title === 'Contractors' && Array.isArray(section.data)
        ? section.data
        : Object.fromEntries(
            Object.entries(section.data)
              .filter(([key, value]) => {
                if (!section.fields.includes(key)) return false;
                return value !== null && value !== undefined && 
                       ((Array.isArray(value) && value.length > 0) || 
                        (typeof value === 'object' && Object.keys(value).length > 0) ||
                        (typeof value === 'string' && value.trim() !== '') ||
                        (typeof value === 'boolean') ||
                        (typeof value === 'number'));
              })
          );

      // Special handling for sections after Hazards
      if (['High Risk Construction Work', 'Notifiable Work', 'Contractors', 'Monitoring & Review'].includes(section.title)) {
        if (yPos < 5) {
          yPos = 5;
        }
      }

      if (twoColumnSections.includes(section.title)) {
        createTwoColumnTable(doc, section, filteredData, yPos, headerColor, borderColor);
      } else {
        createSingleColumnTable(doc, section, filteredData, yPos, headerColor, cellBackgroundColor, borderColor);
      }

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Add page numbers and footer
    addPageFooters(doc, companySettings);

    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
