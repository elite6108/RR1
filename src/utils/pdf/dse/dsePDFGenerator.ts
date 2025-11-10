import 'jspdf-autotable';
import type { DSEAssessment } from './types';
import {
  initializePDF,
  addPDFTitle,
  fetchCompanySettings,
  addCompanyLogo,
  calculatePDFDimensions,
  addPageNumbersAndFooter,
} from './utils';
import {
  createEmployeeInfoTable,
  createAssessmentDetailsTable,
  createKeyboardAssessmentTable,
  createMouseAssessmentTable,
  createScreenAssessmentTable,
  createVisionAssessmentTable,
  createFurnitureAssessmentTable,
  createEnvironmentAssessmentTable,
  createFeedbackTable,
  createNotesTable,
} from './components';

export async function generateDSEPDF(
  assessment: DSEAssessment
): Promise<string> {
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
    addPDFTitle(doc, 'DSE ASSESSMENT');

    // Calculate dimensions
    const dimensions = calculatePDFDimensions(doc);

    let yPos = 45;

    // Employee Information (Left Box)
    createEmployeeInfoTable(doc, assessment, dimensions, yPos);

    // Assessment Details (Right Box)
    createAssessmentDetailsTable(doc, assessment, dimensions, yPos);

    // Ensure we start after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Generate all assessment tables
    yPos = createKeyboardAssessmentTable(doc, assessment, yPos);
    yPos = createMouseAssessmentTable(doc, assessment, yPos);
    yPos = createScreenAssessmentTable(doc, assessment, yPos);
    yPos = createVisionAssessmentTable(doc, assessment, yPos);
    yPos = createFurnitureAssessmentTable(doc, assessment, yPos);
    yPos = createEnvironmentAssessmentTable(doc, assessment, yPos);
    yPos = createFeedbackTable(doc, assessment, yPos);
    yPos = createNotesTable(doc, assessment, yPos);

    // Add page numbers and footer
    addPageNumbersAndFooter(doc, companySettings);

    // Return data URL instead of blob URL to match working quotes pattern
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
