import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions, PolicySection } from './types';
import { parseContentSections } from './utils/htmlProcessor';
import {
  getPDFTheme,
  getPDFDimensions,
  addCompanyLogo,
  addPolicyHeader,
  createCompanyInfoTable,
  createPolicyDetailsTable,
  addPolicySections,
  addPageFooters,
} from './components/pdfComponents';

export async function generateOtherPolicyPDF({
  title,
  content,
  policyNumber,
  companySettings,
  createdAt,
  updatedAt,
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();

    // Get theme and dimensions
    const theme = getPDFTheme();
    const dimensions = getPDFDimensions(doc);

    // Set default font
    doc.setFont('helvetica');

    // Parse sections from content
    const sections: PolicySection[] = parseContentSections(content);

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Add policy header
    addPolicyHeader(doc, policyNumber, theme);

    let yPos = 45;

    // Create company information and policy details tables
    createCompanyInfoTable(doc, companySettings, dimensions, theme, yPos);
    createPolicyDetailsTable(
      doc,
      title,
      policyNumber,
      dimensions,
      theme,
      yPos,
      createdAt,
      updatedAt
    );

    // Add policy sections
    yPos = (doc as any).lastAutoTable.finalY + 10;
    addPolicySections(doc, sections, theme, yPos);

    // Add page footers
    addPageFooters(doc, companySettings);

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
