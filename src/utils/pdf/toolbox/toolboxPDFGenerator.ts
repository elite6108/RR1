import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../../../lib/supabase';
import type { GeneratePDFOptions } from './types';
import { PDF_THEME, PDF_LAYOUT, PDF_STYLES, calculatePDFDimensions } from './utils/constants';
import { addCompanyLogo } from './utils/logoHandler';
import { 
  generateCompanyInfoTable,
  generateTalkInfoTable,
  generateTalkTitleTable,
  generateAttendeesTable
} from './utils/tableGenerators';
import { generateFooter } from './utils/footerGenerator';

export async function generateToolboxPDF({
  talk,
  companySettings
}: GeneratePDFOptions): Promise<string> {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set default font
    doc.setFont(PDF_STYLES.font.family);

    // Add company logo if exists
    await addCompanyLogo(doc, companySettings);

    // Add title
    doc.setFontSize(PDF_LAYOUT.title.fontSize);
    doc.setFont(PDF_STYLES.font.family, PDF_STYLES.font.bold);
    doc.setTextColor(PDF_THEME.themeColor);
    doc.text('TOOLBOX TALK', PDF_LAYOUT.title.x, PDF_LAYOUT.title.y, { align: 'right' });
    
    // Reset text color and font
    doc.setTextColor(0);
    doc.setFontSize(PDF_LAYOUT.body.fontSize);
    doc.setFont(PDF_STYLES.font.family, PDF_STYLES.font.normal);

    // Calculate page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const dimensions = calculatePDFDimensions(pageWidth);
    
    let yPos = PDF_LAYOUT.body.startY;

    // Generate company information table (Left Box)
    generateCompanyInfoTable(doc, companySettings, dimensions, yPos);

    // Generate talk information table (Right Box)
    generateTalkInfoTable(doc, talk, dimensions, yPos);

    // Ensure we start after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + PDF_LAYOUT.body.spacing,
      (doc as any).previousAutoTable.finalY + PDF_LAYOUT.body.spacing
    );

    // Generate talk title table
    generateTalkTitleTable(doc, talk, yPos);
    yPos = (doc as any).lastAutoTable.finalY + PDF_LAYOUT.body.spacing;

    // Generate attendees table
    generateAttendeesTable(doc, talk, yPos);

    // Add footer with page numbers
    generateFooter(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}