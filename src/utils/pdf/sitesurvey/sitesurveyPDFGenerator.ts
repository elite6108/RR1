import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../../../lib/supabase';
import type { GeneratePDFOptions } from './types';
import { layoutConstants } from './utils/constants';
import { addCompanyLogo, setupPDFDocument } from './utils/logoHandler';
import { addPageNumbersAndFooter } from './utils/footerGenerator';
import { 
  processSiteAccessImages, 
  processServicesImages, 
  processDrawingsImages 
} from './utils/imageProcessor';
import {
  generateCompanyInfoTable,
  generateSiteSurveyDetailsTable,
  generateSiteAccessTable,
  generateSiteAccessImagesHeader,
  generateSiteAccessVideosTable,
  generateLandTable,
  generateServicesImagesHeader,
  generateWorkRequiredTable,
  generateCourtFeaturesTable,
  generateEnclosureTypeDetails,
  generateDrawingsPlansHeader,
  generateDrawingsVideosTable,
  generateNotesCommentsTable
} from './utils/tableGenerators';

export async function generateSiteSurveyPDF({
  siteSurvey
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Fetch complete site survey data including customer and project
    const { data: surveyData, error: surveyError } = await supabase
      .from('site_survey')
      .select(`
        *,
        customer:customers(company_name, customer_name),
        project:projects(name)
      `)
      .eq('id', siteSurvey.id)
      .single();

    if (surveyError) throw new Error(`Failed to load site survey: ${surveyError.message}`);
    if (!surveyData) throw new Error('Site survey not found');

    // Fetch company settings for logo
    const { data: companySettings, error: companyError } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (companyError) throw new Error(`Failed to load company settings: ${companyError.message}`);
    if (!companySettings) throw new Error('Company settings not found');

    // Setup PDF document with title and basic styling
    setupPDFDocument(doc);

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    let yPos = layoutConstants.initialYPosition;

    // Company Information (Left Side)
    generateCompanyInfoTable(doc, companySettings, yPos);

    // Site Survey Information (Right Side)
    generateSiteSurveyDetailsTable(doc, surveyData, yPos);

    yPos = layoutConstants.companyInfoYPosition;

    // Site Access Section
    yPos = generateSiteAccessTable(doc, surveyData, yPos);

    // Site Access Images
    if (surveyData.site_access_images && Array.isArray(surveyData.site_access_images) && surveyData.site_access_images.length > 0) {
      const imageHeaderYPos = generateSiteAccessImagesHeader(doc, yPos);
      yPos = await processSiteAccessImages(doc, surveyData.site_access_images, imageHeaderYPos) + 10;
    }

    // Site Access Videos
    yPos = generateSiteAccessVideosTable(doc, surveyData, yPos);

    // Land Section
    yPos = generateLandTable(doc, surveyData, yPos);

    // Services Images (if services are present)
    if (surveyData.services_present && surveyData.services_images && Array.isArray(surveyData.services_images) && surveyData.services_images.length > 0) {
      const imageHeaderYPos = generateServicesImagesHeader(doc, yPos);
      yPos = await processServicesImages(doc, surveyData.services_images, imageHeaderYPos) + 10;
    }

    // Work Required Section
    yPos = generateWorkRequiredTable(doc, surveyData, yPos);

    // Court Features Section
    yPos = generateCourtFeaturesTable(doc, surveyData, yPos);

    // Enclosure Type Details
    if (surveyData.court_enclosure_type) {
      yPos = generateEnclosureTypeDetails(doc, surveyData.court_enclosure_type, yPos);
    }

    // Drawings & Plans Section
    let drawingsYPos = generateDrawingsPlansHeader(doc, yPos);

    // Add drawings/plans images sequentially
    if (surveyData.drawings_images && Array.isArray(surveyData.drawings_images) && surveyData.drawings_images.length > 0) {
      drawingsYPos = await processDrawingsImages(doc, surveyData.drawings_images, drawingsYPos);
    } else {
      // No drawings available
      doc.setFontSize(10);
      doc.text('No drawings or plans uploaded', 15, drawingsYPos);
      drawingsYPos += 15;
    }

    // Drawings Videos
    generateDrawingsVideosTable(doc, surveyData, drawingsYPos + 10);

    // Notes/Comments Section
    if (surveyData.notes_comments) {
      generateNotesCommentsTable(doc, surveyData.notes_comments, (doc as any).lastAutoTable.finalY + 10);
    }

    // Add page numbers and footer
    addPageNumbersAndFooter(doc, companySettings);

    // Convert the PDF to base64
    const pdfBase64 = doc.output('datauristring');
    return pdfBase64;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}
