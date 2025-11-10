import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions } from './types';
import { parseSections, addCompanyLogo } from './utils';
import {
  initializePDF,
  addPDFHeader,
  createCompanyInfoTable,
  createPolicyDetailsTable,
  createContentSection,
  addPageFooter,
} from './components';

export async function generateHSPolicyPDF({
  title,
  content,
  policyNumber,
  companySettings,
  createdAt,
  updatedAt,
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create PDF document
    const doc = new jsPDF();

    // Initialize PDF document
    initializePDF(doc);

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Add PDF header
    addPDFHeader(doc);

    let yPos = 45;

    // Create company information and policy details tables
    createCompanyInfoTable(doc, companySettings, yPos);
    createPolicyDetailsTable(
      doc,
      title,
      policyNumber,
      yPos,
      createdAt,
      updatedAt
    );

    yPos = (doc as any).lastAutoTable.finalY + 20;

    // Parse content into sections and create separate tables
    const sections = parseSections(content);

    for (const section of sections) {
      yPos = await createContentSection(doc, section, yPos);
    }

    // Add page numbers and footer
    addPageFooter(doc, companySettings);

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
