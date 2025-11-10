/*
 * TypeScript-only file - NO JSX ALLOWED
 * This file is for PDF generation using jsPDF library
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFStyles } from '../../../styles/pdffont';
import { 
  GeneratePDFOptions,
} from './types';
import {
  fetchCompanySettings,
  fetchContractData,
  fetchSubcontractorData,
  fetchCustomerData,
  fetchPaymentTerms,
  fetchQuoteData,
  fetchProjectData,
  fetchContractDates,
  fetchSiteManager,
  fetchSiteData,
  getStandardContractSections,
  themeColor,
  addCompanyLogo,
  addPageNumbersAndFooter,
} from './utils';
import {
  addPDFTitle,
  createSupplierBuilderBox,
  createClientCustomerBox,
  createProjectBox,
  createSiteBox,
  addContractSections,
  addSignatureSection,
} from './components';

export async function generateContractPDF({
  contract,
}: GeneratePDFOptions): Promise<string> {
  try {
    // Fetch all required data
    const companySettingsData = await fetchCompanySettings();
    const contractData = await fetchContractData(contract.id);
    const subcontractorDetails = await fetchSubcontractorData(contract.id);
    const customerData = await fetchCustomerData(contractData?.customer_id);
    const paymentTermsData = await fetchPaymentTerms();
    const quoteNumber = await fetchQuoteData(contract.quote_id);
    const projectData = await fetchProjectData(contract.project_id);
    const contractDates = await fetchContractDates(contract.id);
    const siteManager = await fetchSiteManager(contract.site_id);
    const siteData = await fetchSiteData(contract.site_id);

    console.log('Final subcontractorDetails:', subcontractorDetails); // Debug log

    // Create document in portrait orientation
    const doc = new jsPDF();

    // Set default font
    doc.setFont(PDFStyles.font.family);

    // Add company logo if exists
    if (companySettingsData.logo_url) {
      await addCompanyLogo(doc, companySettingsData.logo_url);
    }

    // Add PDF title
    addPDFTitle(doc, contract, themeColor);

    let yPos = 45;

    // Create party boxes
    createSupplierBuilderBox(doc, companySettingsData, yPos);
    createClientCustomerBox(doc, customerData, contract, yPos);

    // Update yPos after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Create project and site boxes
    createProjectBox(doc, projectData, yPos);
    createSiteBox(doc, siteData, yPos);

    // Update yPos after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Get standard contract sections
    const standardSections = getStandardContractSections(
      contract,
      companySettingsData,
      customerData,
      subcontractorDetails,
      paymentTermsData,
      quoteNumber,
      contractDates,
      siteManager
    );

    // Add each standard section
    yPos = addContractSections(doc, standardSections, yPos);

    // Add signature section
    addSignatureSection(doc, companySettingsData, customerData, contract);

    // Add page numbers and footer to all pages
    addPageNumbersAndFooter(doc, companySettingsData, contract.contract_id);

    // Convert to blob URL
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (error instanceof Error) {
      throw new Error(`PDF Generation failed: ${error.message}`);
    } else {
      throw new Error('PDF Generation failed: An unknown error occurred');
    }
  }
}
