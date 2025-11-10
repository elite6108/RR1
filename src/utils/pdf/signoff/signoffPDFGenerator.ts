import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { SignOffPDFOptions } from './types';
import { PDF_THEME } from './utils/constants';
import { fetchSignoffData } from './utils/dataFetcher';
import { addCompanyLogo } from './utils/logoHandler';
import { 
  generateCompanyInfoTable, 
  generateProjectDetailsTable, 
  generateProjectInfoTable, 
  generateSignaturesTable 
} from './utils/tableGenerators';
import { addFooterToAllPages } from './utils/footerGenerator';

export async function generateSignOffPDF({
  projectName,
  date,
  projectId,
  signoffId
}: SignOffPDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set default font
    doc.setFont(PDF_THEME.fonts.default);

    // Get user's full name from local storage
    const selectedName = localStorage.getItem('selectedName') || 'Not Set';

    // Fetch all required data
    const data = await fetchSignoffData(projectId, signoffId);
    const { companySettings } = data;

    // Add company logo if exists
    await addCompanyLogo(doc, companySettings.logo_url);

    // Title
    doc.setFontSize(PDF_THEME.fonts.size.title);
    doc.setFont(PDF_THEME.fonts.default, 'bold');
    doc.setTextColor(PDF_THEME.colors.theme);
    doc.text('PROJECT SIGN OFF', PDF_THEME.layout.title.position.x, PDF_THEME.layout.title.position.y, { align: 'right' });
    
    // Reset text color and font
    doc.setTextColor(PDF_THEME.colors.text);
    doc.setFontSize(PDF_THEME.fonts.size.normal);
    doc.setFont(PDF_THEME.fonts.default, 'normal');

    const pageWidth = doc.internal.pageSize.width;
    const leftColumnX = PDF_THEME.layout.margins.left;
    const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
    const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

    let yPos = PDF_THEME.layout.startY;

    // Generate Company Information (Left Box)
    generateCompanyInfoTable(doc, companySettings, yPos, leftColumnX, boxWidth);

    // Generate Project Details (Right Box)
    generateProjectDetailsTable(doc, data, projectName, yPos, rightColumnX, boxWidth);

    // Ensure we start after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Generate Project Information Section
    generateProjectInfoTable(doc, yPos);

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Generate Signatures Section
    generateSignaturesTable(doc, data, yPos);

    // Add page numbers and footer to all pages
    addFooterToAllPages(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
