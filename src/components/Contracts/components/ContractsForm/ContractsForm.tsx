import React from 'react';
import type { ContractsFormProps, SubcontractorData } from '../../types';
import { useContractsForm } from '../../hooks/useContractsForm';
import { 
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator
} from '../../../../utils/form';
import { 
  Step1Contract, 
  Step2Customer, 
  Step3Project, 
  Step4Description, 
  Step5Subcontractors, 
  Step6Financial 
} from '../form-steps';
import { STEP_LABELS, TOTAL_STEPS, FORM_STEPS } from '../../utils/constants';

export function ContractsForm({
  onClose,
  onSuccess,
  contract,
  preSelectedProjectId,
  disableCustomerAndProject = false,
}: ContractsFormProps) {
  const {
    // State
    currentStep,
    loading,
    error,
    formData,
    projects,
    customers,
    sites,
    quotes,
    subcontractors,
    expandedSubcontractors,
    siteManager,
    siteAddress,
    customerAddress,
    activeDescriptionTab,
    selectedSubcontractors,

    // Actions
    setCurrentStep,
    setFormData,
    setExpandedSubcontractors,
    setSiteManager,
    setSiteAddress,
    setCustomerAddress,
    setActiveDescriptionTab,
    setSelectedSubcontractors,
    handleInputChange,
    handleSubmit
  } = useContractsForm({ 
    contract, 
    preSelectedProjectId, 
    onSuccess, 
    onClose 
  });

  // Helper functions for form step components
  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;

    if (customerId) {
      const selectedCustomer = customers.find(
        (customer) => customer.id === customerId
      );

      if (selectedCustomer) {
        // Format the customer address in one line
        const addressParts = [
          selectedCustomer.address_line1,
          selectedCustomer.address_line2,
          selectedCustomer.town,
          selectedCustomer.county,
          selectedCustomer.post_code,
        ].filter(Boolean);

        const formattedAddress = addressParts.join(', ');

        // Update form data with customer details
        setFormData((prev) => ({
          ...prev,
          customer_id: customerId,
          customer_phone: selectedCustomer.phone,
          customer_email: selectedCustomer.email,
          customer_address: formattedAddress,
        }));
        
        // Update the customerAddress state for the component display
        setCustomerAddress(formattedAddress);
      }
    } else {
      // Reset customer fields if no customer is selected
      setFormData((prev) => ({
        ...prev,
        customer_id: '',
        customer_phone: '',
        customer_email: '',
        customer_address: '',
      }));
      
      // Reset the customerAddress state for the component display
      setCustomerAddress('');
    }
  };

  const handleProjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;

    // Reset site-related fields
    setFormData((prev) => ({
      ...prev,
      project_id: projectId,
      site_id: '',
      site_address: '',
      site_manager: '',
      project_manager: '',
    }));

    if (projectId) {
      // Find project details from the projects array
      const selectedProject = projects.find(p => p.id === projectId);
      if (selectedProject) {
        setFormData((prev) => ({
          ...prev,
          project_manager: selectedProject.project_manager || '',
        }));
      }
    }
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const siteId = e.target.value;

    if (siteId) {
      const selectedSite = sites.find((site) => site.id === siteId);

      if (selectedSite) {
        // Format the site address in one line
        const addressParts = [
          selectedSite.address,
          selectedSite.town,
          selectedSite.county,
          selectedSite.postcode,
        ].filter(Boolean);

        const formattedAddress = addressParts.join(', ');

        // Update form data with site details
        setFormData((prev) => ({
          ...prev,
          site_id: siteId,
          site_address: formattedAddress,
          site_manager: selectedSite.site_manager || '',
        }));
        
        // Update the site state variables for the component display
        setSiteAddress(formattedAddress);
        setSiteManager(selectedSite.site_manager || '');
      }
    } else {
      // Reset site fields if no site is selected
      setFormData((prev) => ({
        ...prev,
        site_id: '',
        site_address: '',
        site_manager: '',
      }));
      
      // Reset the site state variables for the component display
      setSiteAddress('');
      setSiteManager('');
    }
  };

  const addSubcontractor = () => {
    setSelectedSubcontractors([
      ...selectedSubcontractors,
      {
        subcontractor_id: '',
        manager: '',
        responsibilities: '',
      },
    ]);
  };

  const removeSubcontractor = (index: number) => {
    setSelectedSubcontractors(
      selectedSubcontractors.filter((_, i) => i !== index)
    );
  };

  const updateSubcontractor = (
    index: number,
    field: keyof SubcontractorData,
    value: string
  ) => {
    const updated = [...selectedSubcontractors];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSelectedSubcontractors(updated);
  };

  const toggleSubcontractor = (index: number) => {
    const newExpanded = new Set(expandedSubcontractors);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSubcontractors(Array.from(newExpanded));
  };
    
  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader
        title={contract ? 'Edit Contract' : 'New Contract'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />

        <div className="space-y-6">
          {currentStep === FORM_STEPS.CONTRACT && (
            <Step1Contract
              formData={formData}
              handleInputChange={handleInputChange}
              contract={contract}
            />
          )}

          {currentStep === FORM_STEPS.CUSTOMER && (
            <Step2Customer
              formData={formData}
              customers={customers}
              customerAddress={customerAddress}
              onCustomerChange={handleCustomerChange}
              disableCustomerAndProject={disableCustomerAndProject}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === FORM_STEPS.PROJECT && (
            <Step3Project
              formData={formData}
              handleInputChange={handleInputChange}
              projects={projects}
              sites={sites}
              siteAddress={siteAddress}
              siteManager={siteManager}
              onProjectChange={handleProjectChange}
              onSiteChange={handleSiteChange}
              disableCustomerAndProject={disableCustomerAndProject}
              preSelectedProjectId={preSelectedProjectId}
            />
          )}

          {currentStep === FORM_STEPS.DESCRIPTION && (
            <Step4Description
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              activeDescriptionTab={activeDescriptionTab}
              setActiveDescriptionTab={setActiveDescriptionTab}
              quotes={quotes}
            />
          )}

          {currentStep === FORM_STEPS.SUBCONTRACTORS && (
            <Step5Subcontractors
              selectedSubcontractors={selectedSubcontractors}
              subcontractors={subcontractors}
              expandedSubcontractors={expandedSubcontractors}
              onAddSubcontractor={addSubcontractor}
              onRemoveSubcontractor={removeSubcontractor}
              onUpdateSubcontractor={updateSubcontractor}
              onToggleSubcontractor={toggleSubcontractor}
            />
          )}

          {currentStep === FORM_STEPS.FINANCIAL && (
            <Step6Financial
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          )}
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
        onNext={currentStep < TOTAL_STEPS ? () => setCurrentStep(currentStep + 1) : undefined}
        onSubmit={currentStep === TOTAL_STEPS ? handleSubmit : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === TOTAL_STEPS}
        submitButtonText={contract ? 'Update Contract' : 'Save Contract'}
        loading={loading}
      />
    </FormContainer>
  );
}
