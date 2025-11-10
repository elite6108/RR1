import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import { generateRiskAssessmentPDF } from '../../../../utils/pdf/riskassessments/riskAssessmentPDFGenerator';

export const usePDFGeneration = () => {
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePDF = async (assessment: any) => {
    setGeneratingPDF(true);
    setPdfError(null);

    try {
      console.log('Starting PDF generation for assessment:', assessment.ra_id);

      // Fetch company settings
      const { data: companySettings, error: companyError } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (companyError) {
        console.error('Error fetching company settings:', companyError);
        throw new Error(`Failed to load company settings: ${companyError.message}`);
      }
      if (!companySettings) {
        console.error('No company settings found');
        throw new Error('Company settings not found. Please set up your company details first.');
      }

      console.log('Company settings loaded successfully');
      console.log('Starting PDF generation...');

      // Generate PDF
      const pdfDataUrl = await generateRiskAssessmentPDF({
        assessment,
        companySettings
      });

      console.log('PDF generated successfully');

      // Convert data URL to blob for better browser compatibility
      const response = await fetch(pdfDataUrl);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      
      setPdfUrl(pdfUrl);
      console.log('PDF URL set successfully');
      
      return pdfUrl;
    } catch (error) {
      console.error('Error in generatePDF:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while generating the PDF';
      setPdfError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setGeneratingPDF(false);
      console.log('PDF generation process completed');
    }
  };

  const clearPDF = () => {
    if (pdfUrl && pdfUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setPdfError(null);
  };

  return {
    generatingPDF,
    pdfError,
    pdfUrl,
    generatePDF,
    clearPDF
  };
};