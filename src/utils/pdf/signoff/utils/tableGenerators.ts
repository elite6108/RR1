import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../../../../utils/formatters';
import { PDF_THEME, PROJECT_INFO_TEXT, TABLE_HEADERS } from './constants';
import type { SignoffData } from '../types';

/**
 * Generates the company information table
 * @param doc - The jsPDF document instance
 * @param companySettings - Company settings data
 * @param yPos - Y position to start the table
 * @param leftColumnX - X position for left column
 * @param boxWidth - Width of the table box
 */
export function generateCompanyInfoTable(
  doc: jsPDF,
  companySettings: SignoffData['companySettings'],
  yPos: number,
  leftColumnX: number,
  boxWidth: number
): void {
  const { colors } = PDF_THEME;
  
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: TABLE_HEADERS.companyInfo, styles: { fillColor: colors.detailsHeader } }]],
    body: [
      [{
        content: [
          { text: companySettings.name, styles: { fontStyle: 'bold' } },
          { text: '\n' + companySettings.address_line1 },
          { text: companySettings.address_line2 ? '\n' + companySettings.address_line2 : '' },
          { text: `\n${companySettings.town}, ${companySettings.county}` },
          { text: '\n' + companySettings.post_code },
          { text: '\n\n'+ companySettings.phone },
          { text: '\n' + companySettings.email }
        ].map(item => item.text).join(''),
        styles: { cellWidth: 'auto', halign: 'left' }
      }]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: colors.header,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: PDF_THEME.fonts.size.normal,
      cellPadding: 3,
      fillColor: colors.cellBackground,
      lineWidth: 0.1,
      lineColor: colors.border
    },
    margin: { left: leftColumnX, right: leftColumnX + boxWidth },
    tableWidth: boxWidth
  });
}

/**
 * Generates the project details table
 * @param doc - The jsPDF document instance
 * @param data - Sign-off data containing project, customer, and contract info
 * @param projectName - Name of the project
 * @param yPos - Y position to start the table
 * @param rightColumnX - X position for right column
 * @param boxWidth - Width of the table box
 */
export function generateProjectDetailsTable(
  doc: jsPDF,
  data: SignoffData,
  projectName: string,
  yPos: number,
  rightColumnX: number,
  boxWidth: number
): void {
  const { colors } = PDF_THEME;
  const { customer, project, contract } = data;
  
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: TABLE_HEADERS.projectDetails, colSpan: 2, styles: { fillColor: colors.detailsHeader } }]],
    body: [
      [{ content: 'Customer:', styles: { fontStyle: 'bold' } }, customer.company_name || customer.customer_name || 'Unknown Customer'],
      [{ content: 'Project:', styles: { fontStyle: 'bold' } }, projectName],
      [{ content: 'Project Manager:', styles: { fontStyle: 'bold' } }, project.project_manager],
      [{ content: 'Quote:', styles: { fontStyle: 'bold' } }, contract.quotes ? `${contract.quotes.quote_number}` : 'N/A'],
      [{ content: 'Contract:', styles: { fontStyle: 'bold' } }, contract.contract_id || 'N/A'],
      [{ content: 'Project Amount:', styles: { fontStyle: 'bold' } }, formatCurrency(contract.payment_amount)],
      [{ content: 'Project Start:', styles: { fontStyle: 'bold' } }, new Date(contract.project_start_date).toLocaleDateString()],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: colors.header,
      textColor: 'black',
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: PDF_THEME.fonts.size.normal,
      cellPadding: 3,
      fillColor: colors.cellBackground,
      lineWidth: 0.1,
      lineColor: colors.border
    },
    columnStyles: { 
      0: { cellWidth: boxWidth * 0.4 },
      1: { cellWidth: boxWidth * 0.6 }
    },
    margin: { left: rightColumnX, right: PDF_THEME.layout.margins.right },
    tableWidth: boxWidth
  });
}

/**
 * Generates the project information section
 * @param doc - The jsPDF document instance
 * @param yPos - Y position to start the table
 */
export function generateProjectInfoTable(doc: jsPDF, yPos: number): void {
  const { colors } = PDF_THEME;
  
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: TABLE_HEADERS.projectInfo, styles: { fillColor: colors.detailsHeader } }]],
    body: [[
      { content: PROJECT_INFO_TEXT }
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: colors.header,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: PDF_THEME.fonts.size.normal,
      cellPadding: 3,
      fillColor: colors.cellBackground,
      lineWidth: 0.1,
      lineColor: colors.border
    },
    margin: { left: PDF_THEME.layout.margins.left, right: PDF_THEME.layout.margins.right }
  });
}

/**
 * Generates the signatures section
 * @param doc - The jsPDF document instance
 * @param data - Sign-off data containing customer and project manager info
 * @param yPos - Y position to start the table
 */
export function generateSignaturesTable(doc: jsPDF, data: SignoffData, yPos: number): void {
  const { colors } = PDF_THEME;
  const { customer, project } = data;
  
  (doc as any).autoTable({
    startY: yPos,
    head: [[{ content: TABLE_HEADERS.signatures, colSpan: 2, styles: { fillColor: colors.detailsHeader } }]],
    body: [[
      { content: `To be signed by: ${customer.company_name || customer.customer_name || 'Unknown Customer'}\n\nPrint Name: ____________________________\n\nSignature: ______________________________\n\nDate: _________________________________` },
      { content: `To be signed by: ${project.project_manager}\n\nPrint Name: ____________________________\n\nSignature: ______________________________\n\nDate: _________________________________` }
    ]],
    theme: 'grid',
    headStyles: {
      fillColor: colors.header,
      textColor: 'black',
      fontStyle: 'bold'
    },
    styles: {
      fontSize: PDF_THEME.fonts.size.normal,
      cellPadding: 3,
      fillColor: colors.cellBackground,
      lineWidth: 0.1,
      lineColor: colors.border
    },
    margin: { left: PDF_THEME.layout.margins.left, right: PDF_THEME.layout.margins.right }
  });
}
