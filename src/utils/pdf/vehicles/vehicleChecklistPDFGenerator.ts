import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../../../lib/supabase';
import type { GeneratePDFOptions, CompanySettings } from './types';
import { PDF_THEME, LAYOUT_CONFIG } from './utils/constants';
import { addCompanyLogo, setupPDFDefaults, addPDFTitle } from './utils/logoHandler';
import { 
  generateCompanyInfoTable,
  generateVehicleDetailsTable,
  generateOutsideChecksTable,
  generateInsideChecksTable,
  generateAdditionalNotesTable
} from './utils/tableGenerators';
import { addFooterToAllPages } from './utils/footerGenerator';

/**
 * Fetches company settings from the database
 * @returns Promise<CompanySettings>
 */
async function fetchCompanySettings(): Promise<CompanySettings> {
  const { data: companySettings, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (companyError) throw new Error(`Failed to load company settings: ${companyError.message}`);
  if (!companySettings) throw new Error('Company settings not found');

  return companySettings;
}

export async function generateVehicleChecklistPDF({
  checklist,
  vehicle
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set up PDF defaults
    setupPDFDefaults(doc);

    // Fetch company settings
    const companySettings = await fetchCompanySettings();

    // Add company logo
    await addCompanyLogo(doc, companySettings);

    // Add title
    addPDFTitle(doc, 'VEHICLE CHECKLIST', PDF_THEME.themeColor);

    // Calculate layout positions
    const pageWidth = doc.internal.pageSize.width;
    const leftColumnX = LAYOUT_CONFIG.leftMargin;
    const rightColumnX = pageWidth / 2 + 5;
    const boxWidth = pageWidth / 2 - 20;

    let yPos = 45;

    // Generate company information table
    generateCompanyInfoTable(doc, companySettings, yPos, leftColumnX, boxWidth);

    // Generate vehicle details table
    generateVehicleDetailsTable(doc, checklist, vehicle, yPos, rightColumnX, boxWidth);

    // Ensure we start after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Generate outside checks table
    yPos = generateOutsideChecksTable(doc, checklist, yPos);

    // Generate inside checks table
    yPos = generateInsideChecksTable(doc, checklist, yPos);

    // Generate additional notes table
    generateAdditionalNotesTable(doc, checklist, yPos);

    // Add page numbers and footer
    addFooterToAllPages(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}