import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions } from './types';
import { 
  fetchCompanySettings, 
  addCompanyLogo, 
  calculatePageLayout, 
  setupPDFDocument 
} from './utils';
import {
  addDocumentTitle,
  addCompanyInformation,
  addAdditionalWorkDetails,
  addWorkDescription,
  addSignatureSection,
  addFooterAndPageNumbers
} from './components';
import { PAGE_LAYOUT } from './utils/constants';

export async function generateAdditionalWorkPDF({
  additionalWork,
  projectName
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set up basic PDF styling
    setupPDFDocument(doc);

    // Fetch company settings
    const companySettings = await fetchCompanySettings();

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Add document title
    addDocumentTitle(doc);

    // Calculate page layout
    const layout = calculatePageLayout(doc);

    let yPos = PAGE_LAYOUT.initialYPosition;

    // Add company information and additional work details side by side
    addCompanyInformation(doc, companySettings, layout, yPos);
    addAdditionalWorkDetails(doc, additionalWork, projectName, layout, yPos);

    // Ensure we start after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Add work description section
    addWorkDescription(doc, additionalWork, yPos);

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Add signature section
    addSignatureSection(doc, additionalWork, yPos);

    // Add footer and page numbers
    addFooterAndPageNumbers(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
