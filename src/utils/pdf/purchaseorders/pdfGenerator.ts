import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { GeneratePDFOptions } from './types';
import { 
  formatOrderNumber, 
  getPDFTheme, 
  getPDFDimensions, 
  calculateOrderSummary,
  addCompanyLogo,
  addPageFooters,
  setPDFProperties
} from './utils';
import {
  addPDFTitle,
  addCompanyInformationTable,
  addOrderDetailsTable,
  addSupplierTable,
  addDeliveryTable,
  addItemsTable,
  addSummaryTable,
  addNotesTable
} from './components';

export async function generatePurchaseOrderPDF({
  order,
  companySettings,
  supplierName,
  supplierAddress,
  projectName
}: GeneratePDFOptions): Promise<string> {
  try {
    // Format order number to ensure proper format
    const formattedOrderNumber = formatOrderNumber(order.order_number, companySettings.prefix);

    // Create new PDF document
    const doc = new jsPDF();
    
    // Get theme colors and styles
    const theme = getPDFTheme();
    
    // Set default font
    doc.setFont('helvetica');

    // Add company logo if exists
    if (companySettings.logo_url) {
      await addCompanyLogo(doc, companySettings.logo_url);
    }

    // Add PDF title
    addPDFTitle(doc, theme);

    let yPos = 45;
    
    // Get page dimensions
    const dimensions = getPDFDimensions(doc);

    // Add company information and order details tables (side by side)
    addCompanyInformationTable(doc, companySettings, theme, dimensions, yPos);
    addOrderDetailsTable(doc, order, formattedOrderNumber, projectName, theme, dimensions, yPos);

    // Ensure we start after both boxes
    yPos = Math.max(
      (doc as any).lastAutoTable.finalY + 10,
      (doc as any).previousAutoTable.finalY + 10
    );

    // Add supplier details table
    addSupplierTable(doc, supplierName, supplierAddress, theme, yPos);

    // Add delivery information if it exists
    if (order.delivery_to) {
      addDeliveryTable(doc, order.delivery_to, theme, yPos);
    }

    // Add items table
    addItemsTable(doc, order, theme);

    // Calculate order summary
    const summary = calculateOrderSummary(order);

    // Add summary table
    addSummaryTable(doc, summary, theme, (doc as any).lastAutoTable.finalY + 10);

    // Add notes if they exist
    if (order.notes) {
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      addNotesTable(doc, order.notes, theme, finalY);
    }

    // Add page numbers and footer
    addPageFooters(doc, companySettings);

    // Set PDF properties with the proper title and metadata
    setPDFProperties(doc, formattedOrderNumber, supplierName, companySettings.name);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}