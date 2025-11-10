import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CoshhSubstance, CompanySettings } from './types';
import { PDF_STYLES } from './utils/constants';
import { 
  fetchCompanySettings, 
  addCompanyLogoToPDF 
} from './utils';
import { 
  addPDFTitle,
  createCompanyInfoTable,
  createRegisterDetailsTable,
  createSubstancesTable,
  createCategoryBreakdownTable,
  addPageNumbersAndFooter
} from './components';
import { getLatestUpdateDate } from './utils/dataHelpers';

export async function generateCoshhRegisterPDF(substances: CoshhSubstance[]): Promise<string> {
  try {
    // Create new PDF document in landscape orientation (A4 landscape = 297mm x 210mm)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set default font
    doc.setFont('helvetica');

    // Fetch company settings
    const companySettings = await fetchCompanySettings();

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogoToPDF(doc, companySettings.logo_url);
    }

    // Add PDF title
    addPDFTitle(doc, 'COSHH REGISTER', PDF_STYLES.themeColor);

    let yPos = 45;

    const pageWidth = doc.internal.pageSize.width; // This will be larger in landscape
    const leftColumnX = 15; // Left margin
    const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
    const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

    // Company Information (Left Side)
    createCompanyInfoTable(doc, companySettings, PDF_STYLES, yPos, leftColumnX, rightColumnX, boxWidth);

    // Register Information (Right Side)
    const lastUpdated = getLatestUpdateDate(substances);
    createRegisterDetailsTable(doc, substances.length, lastUpdated, PDF_STYLES, yPos, rightColumnX, boxWidth);

    yPos = 110; // Adjusted for landscape

    // COSHH Substances Table with 8 columns - full width table
    createSubstancesTable(doc, substances, PDF_STYLES, yPos, leftColumnX, pageWidth);

    // Add summary information if substances exist
    if (substances.length > 0) {
      yPos = (doc as any).lastAutoTable.finalY + 15;
      createCategoryBreakdownTable(doc, substances, PDF_STYLES, yPos);
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
