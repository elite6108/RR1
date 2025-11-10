import { useState } from 'react';
import { generateCPPPDF } from '../../../../../utils/pdf/cpp/cppPDFGenerator';
import { supabase } from '../../../../../lib/supabase';
import type { CPP, PDFGenerationState } from '../types';
import {
  createLoadingWindow,
  displayPDFInWindow,
  formatCPPFilename,
} from '../utils/pdfWindowUtils';

/**
 * Custom hook for handling PDF generation and viewing
 */
export function usePDFGeneration() {
  const [pdfState, setPdfState] = useState<PDFGenerationState>({
    generatingPDF: false,
    pdfError: null,
    processingCppId: null,
  });

  /**
   * Fetches company settings from Supabase
   */
  const fetchCompanySettings = async () => {
    const { data: companySettings, error: companyError } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (companyError) {
      throw new Error(
        `Failed to load company settings: ${companyError.message}`
      );
    }
    
    if (!companySettings) {
      throw new Error(
        'Company settings not found. Please set up your company details first.'
      );
    }

    return companySettings;
  };

  /**
   * Generates PDF for the given CPP
   */
  const generatePDF = async (cpp: CPP, companySettings: any) => {
    const pdfDataUrl = await generateCPPPDF({
      cpp,
      companySettings,
    });

    return pdfDataUrl;
  };

  /**
   * Handles the complete PDF viewing process
   */
  const handleViewPDF = async (cpp: CPP) => {
    try {
      setPdfState(prev => ({
        ...prev,
        generatingPDF: true,
        processingCppId: cpp.id,
        pdfError: null,
      }));

      // Open the window first (must be synchronous for iOS Safari)
      const newWindow = createLoadingWindow();
      if (!newWindow) {
        return;
      }

      // Fetch company settings
      const companySettings = await fetchCompanySettings();

      // Generate PDF
      const pdfDataUrl = await generatePDF(cpp, companySettings);

      // Format filename for better clarity using CPP number
      const formattedFilename = formatCPPFilename(cpp.cpp_number);

      // Display PDF in the window
      await displayPDFInWindow(newWindow, {
        cpp,
        companySettings,
        formattedFilename,
        pdfDataUrl,
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfState(prev => ({
        ...prev,
        pdfError: error instanceof Error ? error.message : 'An error occurred generating the PDF',
      }));
    } finally {
      setPdfState(prev => ({
        ...prev,
        generatingPDF: false,
        processingCppId: null,
      }));
    }
  };

  /**
   * Clears the PDF error state
   */
  const clearPDFError = () => {
    setPdfState(prev => ({
      ...prev,
      pdfError: null,
    }));
  };

  /**
   * Checks if a specific CPP is currently being processed
   */
  const isProcessingCPP = (cppId: string) => {
    return pdfState.generatingPDF && pdfState.processingCppId === cppId;
  };

  return {
    ...pdfState,
    handleViewPDF,
    clearPDFError,
    isProcessingCPP,
  };
}
