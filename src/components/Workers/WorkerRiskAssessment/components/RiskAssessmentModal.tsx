import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useSignature } from '../hooks/useSignature';
import { usePDFGeneration } from '../hooks/usePDFGeneration';
import { RiskAssessmentData } from '../utils/riskAssessmentUtils';

interface RiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: RiskAssessmentData | null;
  user: any;
  onSignatureSuccess: () => void;
  onSignatureError: (message: string) => void;
}

export const RiskAssessmentModal: React.FC<RiskAssessmentModalProps> = ({
  isOpen,
  onClose,
  assessment,
  user,
  onSignatureSuccess,
  onSignatureError
}) => {
  const {
    signature,
    canvasRef,
    handleSignatureStart,
    handleSignatureStartTouch,
    handleSignatureMove,
    handleSignatureMoveTouch,
    handleSignatureEnd,
    handleSignatureEndTouch,
    handleClearSignature,
    submitDeclaration
  } = useSignature();

  const {
    generatingPDF,
    pdfError,
    pdfUrl,
    generatePDF,
    clearPDF
  } = usePDFGeneration();

  useEffect(() => {
    if (isOpen && assessment) {
      generatePDF(assessment).catch(console.error);
    }

    return () => {
      clearPDF();
    };
  }, [isOpen, assessment]);

  const handleSubmit = async () => {
    if (!assessment) return;

    await submitDeclaration(
      assessment,
      () => {
        onSignatureSuccess();
        handleClose();
      },
      onSignatureError
    );
  };

  const handleClose = () => {
    clearPDF();
    handleClearSignature();
    onClose();
  };

  if (!isOpen || !assessment) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {assessment.name}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row h-full">
            {/* PDF Viewer Section - 80% width on desktop */}
            <div className="w-full md:w-4/5 p-4">
              {generatingPDF ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : pdfError ? (
                <div className="text-red-600 dark:text-red-400 p-4">
                  {pdfError}
                </div>
              ) : pdfUrl ? (
                <div className="h-[600px] border border-gray-300 rounded-md overflow-hidden">
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full border-0"
                    title="Risk Assessment PDF"
                    style={{ minHeight: '600px' }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">PDF will appear here</p>
                </div>
              )}
            </div>

            {/* Declaration Section - 20% width on desktop */}
            <div className="w-full md:w-1/5 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  By signing, I confirm that I have read the Risk Assessment and agree to safely follow the above procedures to the best of my ability.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.full_name || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Signature
                  </label>
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={150}
                    className="border border-gray-300 rounded-md bg-white dark:bg-gray-700 w-full"
                    onMouseDown={handleSignatureStart}
                    onMouseMove={handleSignatureMove}
                    onMouseUp={handleSignatureEnd}
                    onMouseLeave={handleSignatureEnd}
                    onTouchStart={handleSignatureStartTouch}
                    onTouchMove={handleSignatureMoveTouch}
                    onTouchEnd={handleSignatureEndTouch}
                    style={{ touchAction: 'none' }}
                  />
                  <button
                    onClick={handleClearSignature}
                    className="mt-2 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                  >
                    Clear Signature
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString()}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!signature}
                    className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};