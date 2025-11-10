import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions } from './types';
import {
  validatePDFData,
  formatQuoteNumber,
  fetchBankDetails,
  fetchQuoteTerms,
  calculateSubtotal,
  calculateVAT,
  addCompanyLogo,
  setPDFProperties,
  getPDFTheme,
  getPDFDimensions
} from './utils';
import {
  addQuoteTitle,
  addCompanyInformation,
  addQuoteDetails,
  addCustomerInformation,
  addProjectLocation,
  addItemsTable,
  addSummaryTable,
  addNotesSection,
  addDuePayableSection,
  addPaymentTermsSection,
  addBankDetailsSection,
  addTermsAndConditions,
  addPageFooters
} from './components';

export async function generateQuotePDF({
  quote,
  companySettings,
  customerName,
  customerAddress,
  projectName
}: GeneratePDFOptions): Promise<string> {
  try {
    // Validate required data
    validatePDFData(quote, companySettings, customerName, customerAddress, projectName);

    // Format quote number to ensure it's in the correct format
    const formattedQuoteNumber = formatQuoteNumber(quote.quote_number);

    // Fetch bank details and quote terms
    const bankDetails = await fetchBankDetails();
    const quoteTerms = await fetchQuoteTerms();

    // Create new PDF document
    const doc = new jsPDF();
    
    // Get theme and dimensions
    const theme = getPDFTheme();
    const dimensions = getPDFDimensions(doc);
    
    // Set default font
    doc.setFont('helvetica');

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Add quote title
    addQuoteTitle(doc, theme.themeColor);

    let yPos = 45;

    // Add company information and quote details side by side
    addCompanyInformation(doc, companySettings, dimensions, theme, yPos);
    addQuoteDetails(doc, quote, formattedQuoteNumber, projectName, dimensions, theme, yPos);

    // Ensure we start after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Add customer information and project location
    addCustomerInformation(doc, customerName, customerAddress, theme, yPos);
    if (quote.project_location) {
      addProjectLocation(doc, quote.project_location, theme, yPos);
    }

    // Calculate financial values
    const subtotal = calculateSubtotal(quote);
    const vat = calculateVAT(quote, subtotal);

    // Add items table
    addItemsTable(doc, quote, theme);

    // Add summary table
    addSummaryTable(doc, quote, subtotal, vat, theme);
    
    // Add optional sections
    let finalY = (doc as any).lastAutoTable.finalY + 10;

    if (quote.notes) {
      finalY = addNotesSection(doc, quote.notes, theme, finalY);
    }

    if (quote.due_payable) {
      finalY = addDuePayableSection(doc, quote.due_payable, theme, finalY);
    }

    // Add payment terms - either custom or default
    const paymentTermsContent = quote.payment_terms || bankDetails?.terms;
    if (paymentTermsContent) {
      finalY = addPaymentTermsSection(doc, paymentTermsContent, theme, finalY);
    }

    // Add bank details
    if (bankDetails) {
      finalY = addBankDetailsSection(doc, bankDetails, theme, finalY);
    }

    // Add terms & conditions on new page
    if (quoteTerms?.terms) {
      addTermsAndConditions(doc, quoteTerms.terms, theme);
    }

    // Add page footers
    addPageFooters(doc, companySettings);

    // Set PDF properties
    setPDFProperties(doc, formattedQuoteNumber, customerName, companySettings);

    // Return the data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}