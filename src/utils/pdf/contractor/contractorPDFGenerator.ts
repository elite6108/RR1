import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions, Subcontractor } from './types';
import { 
  initializePDF, 
  getPDFTheme, 
  getPDFDimensions, 
  addPDFTitle,
  addCompanyLogo,
  addFooterToAllPages
} from './utils';
import {
  addCompanyInfoSection,
  addInsuranceSection,
  addHealthSafetySection,
  addReviewSection
} from './components';

export const generateBasicContractorPDF = (
  subcontractor: Subcontractor
): void => {
  // This function is kept as a backup
  const doc = new jsPDF();
  doc.save(`${subcontractor.company_name}_review.pdf`);
};

export async function generateContractorPDF({
  contractor,
  companySettings,
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = initializePDF();

    // Get theme colors and styles
    const theme = getPDFTheme();

    // Add company logo if exists (top left)
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Title (top right)
    addPDFTitle(doc, 'CONTRACTOR DETAILS', theme.themeColor);

    // Get PDF dimensions
    const dimensions = getPDFDimensions(doc);

    let yPos = 45;

    // Company Information and Contractor Details
    yPos = addCompanyInfoSection(doc, companySettings, contractor, theme, dimensions, yPos);

    // Insurance Details
    yPos = addInsuranceSection(doc, contractor, theme, yPos);

    // Health & Safety Section
    yPos = addHealthSafetySection(doc, contractor, theme, yPos);

    // Review Details Section
    yPos = addReviewSection(doc, contractor, theme, yPos);

    // Add page numbers and footer
    addFooterToAllPages(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(
      `Failed to generate PDF: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
