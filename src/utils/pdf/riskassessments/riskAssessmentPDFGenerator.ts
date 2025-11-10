import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions } from './types';
import { generateHeaderSection } from './components/headerSection';
import { generateRiskRatingSection } from './components/riskRatingSection';
import { generatePPESection } from './components/ppeSection';
import { generateGuidelinesSection } from './components/guidelinesSection';
import { generateWorkingMethodsSection } from './components/workingMethodsSection';
import { generateHazardsSection } from './components/hazardsSection';
import { addFooterToPages } from './utils/helpers';

export async function generateRiskAssessmentPDF({
  assessment,
  companySettings
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Generate header section (company info, assessment details)
    let yPos = await generateHeaderSection(doc, assessment, companySettings);

    // Generate risk rating table
    yPos = generateRiskRatingSection(doc, yPos);

    // Generate PPE requirements section
    yPos = await generatePPESection(doc, assessment.ppe, yPos);

    // Generate guidelines section
    yPos = generateGuidelinesSection(doc, assessment.guidelines, yPos);

    // Generate working methods section
    yPos = generateWorkingMethodsSection(doc, assessment.working_methods, yPos);

    // Generate hazards section
    yPos = generateHazardsSection(doc, assessment.hazards, yPos);

    // Add page numbers and footer
    addFooterToPages(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}