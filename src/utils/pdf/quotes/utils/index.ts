import jsPDF from 'jspdf';
import { supabase } from '../../../../lib/supabase';
import type { Quote, CompanySettings } from '../../../../types/database';
import type { BankDetails, QuoteTerms, PDFTheme, PDFDimensions } from '../types';

/**
 * Get PDF theme colors and styles
 */
export function getPDFTheme(): PDFTheme {
  return {
    themeColor: '#000000',
    headerColor: '#edeaea',
    cellBackgroundColor: '#f7f7f7',
    itemsHeaderColor: '#edeaea',
    detailsHeaderColor: '#edeaea',
    borderColor: [211, 211, 211] // Light gray border
  };
}

/**
 * Get PDF dimensions and layout settings
 */
export function getPDFDimensions(doc: jsPDF): PDFDimensions {
  const pageWidth = doc.internal.pageSize.width;
  const leftColumnX = 15; // Left margin
  const rightColumnX = pageWidth / 2 + 5; // Adjusted for proper spacing
  const boxWidth = pageWidth / 2 - 20; // Box width for equal spacing

  return {
    pageWidth,
    leftColumnX,
    rightColumnX,
    boxWidth
  };
}

/**
 * Format quote number to ensure it's in the correct format
 */
export function formatQuoteNumber(quoteNumber: string): string {
  return quoteNumber.startsWith('OPG-Q-') 
    ? quoteNumber 
    : `OPG-Q-${quoteNumber.padStart(6, '0')}`;
}

/**
 * Fetch bank details from database
 */
export async function fetchBankDetails(): Promise<BankDetails> {
  const { data: bankDetails } = await supabase
    .from('payment_terms')
    .select('bank_name, account_number, sort_code, terms')
    .limit(1)
    .maybeSingle();

  if (!bankDetails) {
    throw new Error('Bank details not found');
  }

  return bankDetails;
}

/**
 * Fetch quote terms from database
 */
export async function fetchQuoteTerms(): Promise<QuoteTerms | null> {
  const { data: quoteTerms } = await supabase
    .from('quote_terms')
    .select('terms')
    .limit(1)
    .single();

  return quoteTerms;
}

/**
 * Calculate subtotal from quote items or use override
 */
export function calculateSubtotal(quote: Quote): number {
  if (quote.is_subtotal_overridden && quote.override_subtotal !== null) {
    return quote.override_subtotal;
  }
  
  return quote.items.reduce((sum: number, item: any) => {
    const price = item.price === null ? 0 : item.price;
    return sum + price;
  }, 0);
}

/**
 * Calculate VAT amount
 */
export function calculateVAT(quote: Quote, subtotal: number): number {
  return quote.amount > subtotal ? quote.amount - subtotal : 0;
}

/**
 * Add company logo to PDF document
 */
export async function addCompanyLogo(doc: jsPDF, logoUrl: string): Promise<void> {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise<void>((resolve, reject) => {
      reader.onload = () => {
        try {
          if (reader.result) {
            // Calculate dimensions to maintain aspect ratio
            const maxWidth = 40;
            const maxHeight = 20;
            const aspectRatio = 300/91; // Default aspect ratio
            let width = maxWidth;
            let height = width / aspectRatio;
            
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }

            doc.addImage(
              reader.result as string,
              'PNG',
              15,
              15,
              width,
              height,
              undefined,
              'FAST'
            );
          }
          resolve();
        } catch (error) {
          reject(new Error(`Failed to add logo to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read logo file'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading company logo:', error);
    // Continue without logo - don't throw error
  }
}

/**
 * Validate required data for PDF generation
 */
export function validatePDFData(
  quote: Quote,
  companySettings: CompanySettings,
  customerName: string,
  customerAddress: string,
  projectName: string
): void {
  if (!quote || !companySettings || !customerName || !customerAddress || !projectName) {
    throw new Error('Missing required data for PDF generation');
  }
}

/**
 * Set PDF document properties
 */
export function setPDFProperties(
  doc: jsPDF,
  formattedQuoteNumber: string,
  customerName: string,
  companySettings: CompanySettings
): void {
  doc.setProperties({
    title: `Quote ${formattedQuoteNumber}`,
    subject: `Quote for ${customerName}`,
    author: companySettings.name,
    creator: 'OPG System'
  });
}
