import jsPDF from 'jspdf';
import { supabase } from '../../../../lib/supabase';
import type { CompanySettings } from '../../../../types/database';
import type { LogoDimensions } from '../types';
import { LOGO_CONFIG } from './constants';

/**
 * Fetches company settings from Supabase
 */
export async function fetchCompanySettings(): Promise<CompanySettings> {
  const { data: companySettings, error: companyError } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (companyError) {
    throw new Error(`Failed to load company settings: ${companyError.message}`);
  }
  
  if (!companySettings) {
    throw new Error('Company settings not found');
  }

  return companySettings;
}

/**
 * Calculates logo dimensions maintaining aspect ratio
 */
export function calculateLogoDimensions(
  aspectRatio: number = LOGO_CONFIG.defaultAspectRatio
): LogoDimensions {
  const { maxWidth, maxHeight, position } = LOGO_CONFIG;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width,
    height,
    x: position.x,
    y: position.y
  };
}

/**
 * Adds company logo to PDF document
 */
export async function addCompanyLogo(
  doc: jsPDF, 
  logoUrl: string
): Promise<void> {
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
            const dimensions = calculateLogoDimensions();
            
            doc.addImage(
              reader.result as string,
              'PNG',
              dimensions.x,
              dimensions.y,
              dimensions.width,
              dimensions.height,
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
 * Calculates page layout dimensions
 */
export function calculatePageLayout(doc: jsPDF) {
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
 * Sets up PDF document with basic styling
 */
export function setupPDFDocument(doc: jsPDF): void {
  // Set default font
  doc.setFont('helvetica');
}

/**
 * Formats currency amount with VAT information
 */
export function formatCurrency(amount: number, vatType?: string): string {
  return `£${amount.toFixed(2)} ${vatType || 'Inc VAT'}`;
}
