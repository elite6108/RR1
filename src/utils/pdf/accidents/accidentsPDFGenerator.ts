import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../../../lib/supabase';
import { GeneratePDFOptions } from './types';
import { 
  FORM_FIELD_CONFIGS,
  addCompanyLogo,
  addCompanyInfoTable,
  addReportDetailsTable,
  createSectionRows,
  addSectionTable,
  addFooter,
  processAllImages,
  PDF_THEME
} from './utils';

export async function generateAccidentsPDF({
  reportData,
  tableName
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set default font
    doc.setFont('helvetica');

    // Fetch company settings for logo
    const { data: companySettings, error: companyError } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (companyError) throw new Error(`Failed to load company settings: ${companyError.message}`);
    if (!companySettings) throw new Error('Company settings not found');

    // Fetch current user for display name
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(`Failed to get user: ${userError.message}`);
    
    const createdByName = user?.user_metadata?.display_name || reportData.created_by_name || 'N/A';

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Get form configuration
    const formConfig = FORM_FIELD_CONFIGS[tableName as keyof typeof FORM_FIELD_CONFIGS];
    if (!formConfig) {
      throw new Error(`No configuration found for table: ${tableName}`);
    }

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(PDF_THEME.themeColor);
    doc.text(formConfig.title, 195, 25, { align: 'right' });
    
    // Reset text color and font
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let yPos = 45;

    // Company Information (Left Side) and Report Details (Right Side)
    addCompanyInfoTable(doc, companySettings, yPos);
    addReportDetailsTable(doc, reportData, createdByName, yPos);

    yPos = 125;

    // Render each section dynamically based on form configuration
    for (const section of formConfig.sections) {
      const sectionRows = createSectionRows(section.fields, reportData);
      yPos = addSectionTable(doc, section.title, sectionRows, yPos);
    }

    // Add page numbers and footer
    addFooter(doc, companySettings);

    // Additional Images Section
    await processAllImages(doc, reportData.file_urls, yPos);

    // Re-add page numbers and footer after adding images
    addFooter(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}