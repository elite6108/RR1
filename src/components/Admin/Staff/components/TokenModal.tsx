import React from 'react';
import { RotateCcw, Clipboard } from 'lucide-react';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput
} from '../../../../utils/form';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyToken: string;
  workerToken: string;
  onGenerateCompanyToken: () => void;
  onGenerateWorkerToken: () => void;
  onCopyToken: (token: string) => void;
  tokenLoading: number | null;
}

export function TokenModal({
  isOpen,
  onClose,
  companyToken,
  workerToken,
  onGenerateCompanyToken,
  onGenerateWorkerToken,
  onCopyToken,
  tokenLoading
}: TokenModalProps) {
  if (!isOpen) return null;

  return (
    <FormContainer isOpen={isOpen} maxWidth="2xl">
      <FormHeader
        title="Manage Tokens"
        onClose={onClose}
      />
      
      <FormContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Company Token</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">This token is for administrative access.</p>
            <FormField label="">
              <div className="flex items-center space-x-2">
                <TextInput
                  value={companyToken}
                  onChange={() => {}} // Read-only
                  disabled
                  className="bg-gray-100 dark:bg-gray-700"
                />
                <button 
                  onClick={onGenerateCompanyToken} 
                  disabled={tokenLoading === 0}
                  className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  title="Generate new token"
                >
                  <RotateCcw className={`h-5 w-5 ${tokenLoading === 0 ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={() => onCopyToken(companyToken)} 
                  className="p-2 text-white bg-green-600 rounded-md hover:bg-green-700 flex-shrink-0"
                  title="Copy token"
                >
                  <Clipboard className="h-5 w-5" />
                </button>
              </div>
            </FormField>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Worker Token</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">This token is for general staff access.</p>
            <FormField label="">
              <div className="flex items-center space-x-2">
                <TextInput
                  value={workerToken}
                  onChange={() => {}} // Read-only
                  disabled
                  className="bg-gray-100 dark:bg-gray-700"
                />
                <button 
                  onClick={onGenerateWorkerToken} 
                  disabled={tokenLoading === -1}
                  className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  title="Generate new token"
                >
                  <RotateCcw className={`h-5 w-5 ${tokenLoading === -1 ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={() => onCopyToken(workerToken)} 
                  className="p-2 text-white bg-green-600 rounded-md hover:bg-green-700 flex-shrink-0"
                  title="Copy token"
                >
                  <Clipboard className="h-5 w-5" />
                </button>
              </div>
            </FormField>
          </div>
        </div>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        isLastStep={true}
        submitButtonText="Close"
        showPrevious={false}
        onSubmit={onClose}
      />
    </FormContainer>
  );
}
