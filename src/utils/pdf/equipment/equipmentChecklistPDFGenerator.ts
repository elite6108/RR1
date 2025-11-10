import 'jspdf-autotable';
import type { GeneratePDFOptions } from './types';
import {
  initializePDF,
  fetchCompanySettings,
  addCompanyLogo,
  addPDFTitle,
  calculatePDFDimensions,
  extractFooterData,
  addPageFooters
} from './utils';
import {
  generateCompanyInfoTable,
  generateEquipmentDetailsTable,
  generateChecklistItemsTable,
  generateAdditionalNotesTable,
  getLastTableFinalY
} from './components';

export async function generateEquipmentChecklistPDF({
  checklist,
  equipment
}: GeneratePDFOptions): Promise<string> {
  try {
    // Initialize PDF document
    const doc = initializePDF();
    
    // Fetch company settings
    const companySettings = await fetchCompanySettings();

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Add PDF title
    addPDFTitle(doc);

    // Calculate dimensions
    const dimensions = calculatePDFDimensions(doc);
    let yPos = 45;

    // Generate company information table (Left Side)
    generateCompanyInfoTable(doc, companySettings, dimensions, yPos);

    // Generate equipment details table (Right Side)
    generateEquipmentDetailsTable(doc, checklist, equipment, dimensions, yPos);

    // Generate checklist items table
    yPos = 125;
    generateChecklistItemsTable(doc, checklist, yPos);

    // Generate additional notes table if notes exist
    yPos = getLastTableFinalY(doc) + 10;
    generateAdditionalNotesTable(doc, checklist, yPos);

    // Add page footers
    const footerData = extractFooterData(companySettings);
    addPageFooters(doc, footerData);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}