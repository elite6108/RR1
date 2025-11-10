import React, { useState } from 'react';
import type { CompanySettingsFormProps, TabType } from './types';
import { useCompanySettings } from './hooks/useCompanySettings';
import { useLogoUpload } from './hooks/useLogoUpload';
import { useFormSubmission } from './hooks/useFormSubmission';
import { TabNavigation } from './components/TabNavigation';
import { ErrorMessage } from './components/ErrorMessage';
import { SuccessMessage } from './components/SuccessMessage';
import { 
  CompanyInfoTab, 
  ContactTab, 
  TaxInfoTab, 
  PrefixTab, 
  InsurancesTab 
} from './components/tabs';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter 
} from '../../utils/form';

export function CompanySettingsForm({ onClose }: CompanySettingsFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('company');
  
  // Custom hooks
  const { formData, handleChange, updateFormData } = useCompanySettings();
  const { uploadingLogo, handleLogoUpload } = useLogoUpload(formData, updateFormData);
  const { loading, error, success, handleSubmit, clearError } = useFormSubmission(formData, onClose);

  // Handle logo upload with error handling
  const handleLogoUploadWithError = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      clearError();
      await handleLogoUpload(e);
    } catch (err) {
      // Error handling is done in the hook, but we could add additional handling here if needed
    }
  };

  // Handle form submission for FormFooter
  const handleFormSubmit = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader 
        title="Company Settings" 
        onClose={onClose} 
      />
      
      <FormContent>
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Tab Content */}
          {activeTab === 'company' && (
            <CompanyInfoTab 
              formData={formData}
              handleChange={handleChange}
              handleLogoUpload={handleLogoUploadWithError}
              uploadingLogo={uploadingLogo}
            />
          )}

          {activeTab === 'contact' && (
            <ContactTab 
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'tax' && (
            <TaxInfoTab 
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'prefix' && (
            <PrefixTab 
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeTab === 'insurances' && (
            <InsurancesTab 
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {error && <ErrorMessage error={error} />}
          {success && <SuccessMessage />}
        </form>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onSubmit={handleFormSubmit}
        isLastStep={true}
        submitButtonText={loading ? 'Saving...' : 'Save Settings'}
        disabled={loading || uploadingLogo}
        loading={loading}
      />
    </FormContainer>
  );
}