import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CoshhAssessment } from './types';
import { PDF_STYLES } from './utils/constants';
import { 
  fetchCompanySettings, 
  addCompanyLogoToPDF,
  parseArrayField,
  parseIngredientItems
} from './utils';
import { 
  addPDFTitle,
  createCompanyInfoTable,
  createAssessmentDetailsTable,
  createSubstanceDetailsTable,
  createChemicalPropertiesTable,
  createIngredientItemsTable,
  createPPERequirementsTable,
  createHazardsTable,
  createExposureInformationTable,
  createUsageFrequencyTable,
  createControlMeasuresTable,
  createEmergencyProceduresTable,
  createAssessmentCommentsTable,
  createAssessorSummaryTable,
  createAssessmentConclusionTable,
  createPPELocationTable,
  addPageNumbersAndFooter
} from './components';

export async function generateCoshhAssessmentPDF(assessment: CoshhAssessment): Promise<string> {
  try {
    console.log('Starting PDF generation process...');
    console.log('Assessment data received:', assessment);
    
    // Parse array fields
    const personsAtRisk = parseArrayField(assessment.persons_at_risk);
    const routesOfEntry = parseArrayField(assessment.routes_of_entry);
    const selectedPPE = parseArrayField(assessment.selected_ppe);
    const selectedHazards = parseArrayField(assessment.selected_hazards);
    const additionalControlItems = parseArrayField(assessment.additional_control_items);
    const ingredientItems = parseIngredientItems(assessment.ingredient_items);

    console.log('Parsed data arrays successfully');
    
    // Check if jsPDF is available
    if (typeof jsPDF === 'undefined') {
      throw new Error('jsPDF library is not available. Please ensure jsPDF is installed.');
    }
    
    // Create new PDF document in portrait orientation
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set default font
    doc.setFont('helvetica');

    // Fetch company settings
    const companySettings = await fetchCompanySettings();
    console.log('Company settings loaded:', companySettings.name);

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogoToPDF(doc, companySettings.logo_url);
    }

    // Add PDF title
    addPDFTitle(doc, 'COSHH ASSESSMENT', PDF_STYLES.themeColor);

    let yPos = 45;
    const pageWidth = doc.internal.pageSize.width;
    const leftColumnX = 15;
    const rightColumnX = pageWidth / 2 + 5;
    const boxWidth = pageWidth / 2 - 20;

    // Company Information (Left Side)
    createCompanyInfoTable(doc, companySettings, PDF_STYLES, yPos, leftColumnX, rightColumnX, boxWidth);

    // Assessment Information (Right Side)
    createAssessmentDetailsTable(
      doc, 
      assessment.assessment_date, 
      assessment.review_date, 
      assessment.assessor_name, 
      assessment.coshh_reference, 
      assessment.hazard_level, 
      PDF_STYLES, 
      yPos, 
      rightColumnX, 
      boxWidth
    );

    yPos = 110;

    // Substance Details Table
    createSubstanceDetailsTable(doc, assessment, personsAtRisk, routesOfEntry, PDF_STYLES, yPos);
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Chemical Properties Section
    createChemicalPropertiesTable(doc, assessment, PDF_STYLES, yPos);
    if ((assessment.carcinogen !== undefined) || (assessment.sk !== undefined) || (assessment.sen !== undefined)) {
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Ingredient Items Section
    createIngredientItemsTable(doc, ingredientItems, PDF_STYLES, yPos);
    if (ingredientItems.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // PPE Requirements Section with Images
    await createPPERequirementsTable(doc, selectedPPE, PDF_STYLES, yPos);
    if (selectedPPE.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 10;

      // PPE Location if provided
      createPPELocationTable(doc, assessment.ppe_location, PDF_STYLES, yPos);
      if (assessment.ppe_location) {
        yPos = (doc as any).lastAutoTable.finalY + 10;
      }
    }

    // Hazards Section with Images
    await createHazardsTable(doc, selectedHazards, PDF_STYLES, yPos);
    if (selectedHazards.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Exposure Information Section
    createExposureInformationTable(doc, assessment, PDF_STYLES, yPos);
    if (assessment.hazards_precautions || assessment.occupational_exposure || assessment.maximum_exposure || 
        assessment.workplace_exposure || assessment.stel || assessment.stability_reactivity || assessment.ecological_information) {
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Usage Frequency Section
    createUsageFrequencyTable(doc, assessment, PDF_STYLES, yPos);
    if (assessment.amount_used || assessment.times_per_day || assessment.duration || 
        assessment.how_often_process || assessment.how_long_process) {
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Check if we need a new page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    // Control Measures Section
    createControlMeasuresTable(doc, assessment, additionalControlItems, PDF_STYLES, yPos);
    if (assessment.general_precautions || assessment.first_aid_measures || assessment.accidental_release_measures ||
        assessment.ventilation || assessment.handling || assessment.storage || additionalControlItems.length > 0 ||
        assessment.further_controls || assessment.respiratory_protection || assessment.ppe_details ||
        assessment.monitoring || assessment.health_surveillance || assessment.responsibility || assessment.by_when) {
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Emergency Procedures Section
    if (assessment.spillage_procedure || assessment.fire_explosion || assessment.handling_storage || assessment.disposal_considerations) {
      // Check if we need a new page before creating the table
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      createEmergencyProceduresTable(doc, assessment, PDF_STYLES, yPos);
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Assessment Comments
    if (assessment.assessment_comments) {
      // Check if we need a new page before creating the table
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }
      createAssessmentCommentsTable(doc, assessment.assessment_comments, PDF_STYLES, yPos);
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Assessment Questions Summary
    // Check if we need a new page before creating the table
    if (yPos > 180) {
      doc.addPage();
      yPos = 20;
    }

    createAssessorSummaryTable(doc, assessment, PDF_STYLES, yPos);
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Assessment Conclusion
    if (assessment.assessment_conclusion) {
      // Check if we need a new page before creating the table
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      createAssessmentConclusionTable(doc, assessment.assessment_conclusion, PDF_STYLES, yPos);
    }

    // Add page numbers and footer
    addPageNumbersAndFooter(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}