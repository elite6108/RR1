import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { generateHSPolicyPDF } from '../../../../utils/pdf/healthsafetypolicy/HSPolicyPDFGenerator';
import { generateOtherPolicyPDF } from '../../../../utils/pdf/otherpolicies/otherPoliciesPDFGenerator';
import { useSignature } from '../hooks/useSignature';
import { PolicyData } from '../utils/policyUtils';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: PolicyData | null;
  user: any;
  onSignatureSuccess: (message: string) => void;
  onSignatureError: (message: string) => void;
  onPolicyRefresh: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  policy,
  user,
  onSignatureSuccess,
  onSignatureError,
  onPolicyRefresh,
}) => {
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    submitPolicySignature,
    loading: signatureLoading,
  } = useSignature();

  useEffect(() => {
    if (isOpen && policy) {
      handleOpenPolicy();
    }

    // Cleanup function to revoke blob URLs when component unmounts or policy changes
    return () => {
      if (filePreviewUrl && filePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [isOpen, policy]);

  const handleOpenPolicy = async () => {
    if (!policy) return;

    try {
      setLoading(true);

      // Handle file preview based on policy type and source
      if (policy.type === 'uploaded' && policy.file_name) {
        // For uploaded PDF files, get signed URL from storage
        let bucketName = 'other-policies';
        if (policy.source === 'hs_policy_files') {
          bucketName = 'hs-policies';
        }

        const { data: urlData } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(policy.file_name, 3600);

        if (urlData?.signedUrl) {
          setFilePreviewUrl(urlData.signedUrl);
        }
      } else if (policy.type === 'created' && policy.content) {
        // For created policies, generate PDF using appropriate generator
        try {
          // Get company settings for PDF generation
          const { data: companySettings, error: companyError } = await supabase
            .from('company_settings')
            .select('*')
            .limit(1)
            .maybeSingle();

          if (companyError) throw companyError;
          if (!companySettings) throw new Error('Company settings not found');

          let pdfDataUrl;

          if (policy.source === 'hs_policy_files') {
            // Use HS Policy PDF generator
            pdfDataUrl = await generateHSPolicyPDF({
              title:
                policy.display_name || policy.file_name || 'Unknown Policy',
              content: policy.content,
              policyNumber: policy.policy_number,
              companySettings,
              createdAt: policy.created_at,
              updatedAt: policy.updated_at,
            });
          } else {
            // Use Other Policies PDF generator
            pdfDataUrl = await generateOtherPolicyPDF({
              title:
                policy.display_name || policy.file_name || 'Unknown Policy',
              content: policy.content,
              policyNumber: policy.policy_number || 1,
              companySettings,
              createdAt: policy.created_at,
              updatedAt: policy.updated_at,
            });
          }

          // Convert data URL to blob for better browser compatibility
          const response = await fetch(pdfDataUrl);
          const blob = await response.blob();
          const pdfUrl = URL.createObjectURL(blob);

          setFilePreviewUrl(pdfUrl);
        } catch (pdfError) {
          console.error('Error generating PDF:', pdfError);
          setFilePreviewUrl(null);
        }
      }
    } catch (err) {
      console.error('Error opening policy:', err);
      onSignatureError(
        'Could not open the policy document. Please try again or contact your administrator if the problem persists.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!policy) return;

    await submitPolicySignature(
      policy,
      (message) => {
        onSignatureSuccess(message);
        onPolicyRefresh();
        handleClose();
      },
      onSignatureError
    );
  };

  const handleClose = () => {
    // Clean up blob URL to prevent memory leaks
    if (filePreviewUrl && filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl(null);
    handleClearSignature();
    onClose();
  };

  if (!isOpen || !policy) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {policy.name}
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
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : filePreviewUrl ? (
                <iframe
                  src={filePreviewUrl}
                  className="w-full h-[600px]"
                  title={policy.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <p>Preview not available</p>
                </div>
              )}
            </div>

            {/* Declaration Section - 20% width on desktop */}
            <div className="w-full md:w-1/5 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  By signing, I confirm that I have read and understood this
                  policy and agree to comply with all requirements outlined
                  within.
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
                    disabled={!signature || signatureLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {signatureLoading ? 'Saving...' : 'Submit'}
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
