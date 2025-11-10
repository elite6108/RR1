import { useState } from 'react';
import { handlePDFGeneration } from '../utils/pdfGenerator';
import { SignOff, Project } from '../types';

export function usePDFGeneration() {
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const generatePDF = async (signoff: SignOff, project: Project) => {
    try {
      setGeneratingPdfId(signoff.id);
      setPdfError(null);
      
      await handlePDFGeneration({
        projectName: project.name,
        date: new Date(signoff.created_at).toLocaleDateString(),
        projectId: project.id,
        signoffId: signoff.id
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      setPdfError(err instanceof Error ? err.message : 'An error occurred generating the PDF');
    } finally {
      setGeneratingPdfId(null);
    }
  };

  return {
    generatingPdfId,
    pdfError,
    generatePDF
  };
}
