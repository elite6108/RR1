import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { FirstAidPDFOptions } from './types';
import { processFirstAidAssessmentData, generateAssessmentId } from './utils/dataHelpers';
import {
  getPDFTheme,
  getPDFDimensions,
  addCompanyLogo,
  addAssessmentHeader,
  createCompanyInfoTable,
  createAssessmentDetailsTable,
  addAssessmentSections,
  addPageFooters
} from './components/pdfComponents';

/**
 * Generates a PDF document for a First Aid Needs Assessment
 * 
 * @param options - The options for generating the PDF including assessment data and company settings
 * @returns Promise that resolves to a data URL string of the generated PDF
 */
export async function generateFirstAidPDF({
  assessmentData,
  companySettings
}: FirstAidPDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Get theme and dimensions
    const theme = getPDFTheme();
    const dimensions = getPDFDimensions(doc);
    
    // Set default font
    doc.setFont('helvetica');

    // Process the assessment data into PDF-friendly format
    const processedData = processFirstAidAssessmentData(assessmentData);
    
    // Fallback for businessInfo if it's missing
    const safeProcessedData = {
      ...processedData,
      businessInfo: processedData.businessInfo || {
        natureOfBusiness: 'Not specified',
        numberOfEmployees: 'Not specified',
        publicVisitPremises: 'Not specified'
      }
    };

    // Generate assessment ID if not provided
    if (!safeProcessedData.basicInfo.assessmentId || safeProcessedData.basicInfo.assessmentId === 'Not specified') {
      safeProcessedData.basicInfo.assessmentId = generateAssessmentId();
    }

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Add assessment header
    addAssessmentHeader(doc, safeProcessedData.basicInfo.assessmentId, theme);

    let yPos = 45;
    
    // Create company information and assessment details tables
    createCompanyInfoTable(doc, companySettings, dimensions, theme, yPos);
    createAssessmentDetailsTable(doc, safeProcessedData, dimensions, theme, yPos);

    // Add assessment sections
    yPos = (doc as any).lastAutoTable.finalY + 10;
    addAssessmentSections(doc, safeProcessedData.sections, theme, yPos);

    // Add page footers
    addPageFooters(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('First Aid PDF Generation Error:', error);
    throw new Error(`Failed to generate First Aid PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convenience function to generate a First Aid PDF with default settings
 * 
 * @param assessmentData - The first aid needs assessment data
 * @param companySettings - The company settings for branding
 * @returns Promise that resolves to a data URL string of the generated PDF
 */
export async function generateFirstAidAssessmentPDF(
  assessmentData: FirstAidPDFOptions['assessmentData'],
  companySettings: FirstAidPDFOptions['companySettings']
): Promise<string> {
  return generateFirstAidPDF({
    assessmentData,
    companySettings
  });
}