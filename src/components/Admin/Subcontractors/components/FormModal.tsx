import React from 'react';
import { SubcontractorFormData, InsuranceDetails } from '../types';
import { Calendar } from '../../../../utils/calendar/Calendar';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator,
  FormField,
  TextInput
} from '../../../../utils/form';

interface FormModalProps {
  showModal: boolean;
  editingContractor: any | null;
  currentStep: number;
  formData: SubcontractorFormData;
  customInsuranceTypes: string[];
  onClose: () => void;
  onStepChange: (step: number) => void;
  onSubmit: (data: SubcontractorFormData) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInsuranceChange: (
    type: keyof SubcontractorFormData,
    field: keyof InsuranceDetails,
    value: string
  ) => void;
  onFileUpload: (file: File, type: 'swms' | 'health_safety' | 'additional') => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<SubcontractorFormData>>;
  setCustomInsuranceTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FormModal = ({
  showModal,
  editingContractor,
  currentStep,
  formData,
  customInsuranceTypes,
  onClose,
  onStepChange,
  onSubmit,
  onInputChange,
  onInsuranceChange,
  onFileUpload,
  setFormData,
  setCustomInsuranceTypes,
}) => {
  if (!showModal) return null;

  const stepLabels = ['Company Info', 'Insurances', 'Documents', 'Review'];

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            <h4 className="text-lg font-medium sticky top-0 bg-white py-2">
              Company Info
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <FormField label="Company Name" required>
                <TextInput
                  value={formData.company_name}
                  onChange={(e) => onInputChange({ target: { name: 'company_name', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                />
              </FormField>

              <FormField label="Address" required>
                <TextInput
                  value={formData.address}
                  onChange={(e) => onInputChange({ target: { name: 'address', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                />
              </FormField>

              <FormField label="Phone" required>
                <TextInput
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => onInputChange({ target: { name: 'phone', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                  placeholder="+44"
                />
              </FormField>

              <FormField label="Email" required>
                <TextInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => onInputChange({ target: { name: 'email', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                />
              </FormField>

              <FormField label="Services Provided" description="(optional)">
                <TextInput
                  value={formData.services_provided}
                  onChange={(e) => onInputChange({ target: { name: 'services_provided', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                />
              </FormField>

              <FormField label="Nature of Business" required>
                <TextInput
                  value={formData.nature_of_business}
                  onChange={(e) => onInputChange({ target: { name: 'nature_of_business', value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                />
              </FormField>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 max-h-[500px] overflow-y-auto">
            <div className="sticky top-0 bg-white py-2 z-10">
              <h4 className="text-lg font-medium">Insurances</h4>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Insurance Expiry Date <span className="text-red-500">*</span>
                </label>
                <Calendar
                  selectedDate={formData.insurance_exp_date}
                  onDateSelect={(date) => {
                    const event = { target: { name: 'insurance_exp_date', value: date } } as React.ChangeEvent<HTMLInputElement>;
                    onInputChange(event);
                  }}
                  placeholder="Select insurance expiry date"
                  className="mt-1"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Review Date <span className="text-red-500">*</span>
                </label>
                <Calendar
                  selectedDate={formData.review_date}
                  onDateSelect={(date) => {
                    const event = { target: { name: 'review_date', value: date } } as React.ChangeEvent<HTMLInputElement>;
                    onInputChange(event);
                  }}
                  placeholder="Select review date"
                  className="mt-1"
                />
              </div>
              <button
                onClick={() => {
                  const newType = `custom_insurance_${customInsuranceTypes.length + 1}`;
                  setCustomInsuranceTypes([...customInsuranceTypes, newType]);
                  setFormData((prev) => ({
                    ...prev,
                    [newType]: {
                      insurer: '',
                      policy_no: '',
                      renewal_date: '',
                      limit_of_indemnity: '',
                    },
                  }));
                }}
                className="mt-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Add New Insurance Type
              </button>
            </div>
            {[
              'employers_liability',
              'public_liability',
              'professional_negligence',
              'contractors_all_risk',
              ...customInsuranceTypes,
            ].map((insurance) => (
              <div key={insurance} className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-md font-medium">
                    {insurance.startsWith('custom_insurance_')
                      ? `Custom Insurance ${insurance.split('_').pop()}`
                      : insurance
                          .split('_')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                  </h5>
                  {insurance.startsWith('custom_insurance_') && (
                    <button
                      onClick={() => {
                        setCustomInsuranceTypes(
                          customInsuranceTypes.filter((type) => type !== insurance)
                        );
                        setFormData((prev) => {
                          const newData = { ...prev };
                          delete (newData as any)[insurance];
                          return newData;
                        });
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Insurer{' '}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={(formData as any)[insurance]?.insurer || ''}
                      onChange={(e) =>
                        onInsuranceChange(
                          insurance as keyof SubcontractorFormData,
                          'insurer',
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-lg-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Policy Number{' '}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={(formData as any)[insurance]?.policy_no || ''}
                      onChange={(e) =>
                        onInsuranceChange(
                          insurance as keyof SubcontractorFormData,
                          'policy_no',
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-lg-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Renewal Date{' '}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <Calendar
                      selectedDate={(formData as any)[insurance]?.renewal_date || ''}
                      onDateSelect={(date) =>
                        onInsuranceChange(
                          insurance as keyof SubcontractorFormData,
                          'renewal_date',
                          date
                        )
                      }
                      placeholder="Select renewal date"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Limit of Indemnity{' '}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={(formData as any)[insurance]?.limit_of_indemnity || ''}
                      onChange={(e) =>
                        onInsuranceChange(
                          insurance as keyof SubcontractorFormData,
                          'limit_of_indemnity',
                          e.target.value
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-lg-sm p-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            <h4 className="text-lg font-medium sticky top-0 bg-white py-2">
              Documents
            </h4>
            
            {/* SWMS */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Has the contractor submitted a SWMS? <span className="text-gray-400">(optional)</span>
                </h5>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, has_swms: true }))}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.has_swms
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-green-300'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, has_swms: false }))}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !formData.has_swms
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-red-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              {formData.has_swms && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload SWMS File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFileUpload(file, 'swms');
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              )}
            </div>

            {/* Health & Safety Policy */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  Health & Safety Policy? <span className="text-gray-400">(optional)</span>
                </h5>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, has_health_safety_policy: true }))}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.has_health_safety_policy
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-green-300'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, has_health_safety_policy: false }))}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !formData.has_health_safety_policy
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-red-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              {formData.has_health_safety_policy && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Health & Safety Policy File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFileUpload(file, 'health_safety');
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              )}
            </div>

            {/* Additional Files */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Additional Files (Optional)
              </h5>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach((file) => onFileUpload(file, 'additional'));
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            <h4 className="text-lg font-medium sticky top-0 bg-white py-2">
              Review & Submit
            </h4>
            <div className="space-y-3">
              <div>
                <strong>Company Name:</strong> {formData.company_name}
              </div>
              <div>
                <strong>Address:</strong> {formData.address}
              </div>
              <div>
                <strong>Phone:</strong> {formData.phone}
              </div>
              <div>
                <strong>Email:</strong> {formData.email}
              </div>
              <div>
                <strong>Services Provided:</strong> {formData.services_provided}
              </div>
              <div>
                <strong>Nature of Business:</strong> {formData.nature_of_business}
              </div>
              <div>
                <strong>Insurance Expiry Date:</strong> {formData.insurance_exp_date}
              </div>
              <div>
                <strong>Review Date:</strong> {formData.review_date}
              </div>
              <div>
                <strong>SWMS:</strong> {formData.has_swms ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Health & Safety Policy:</strong>{' '}
                {formData.has_health_safety_policy ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <FormContainer isOpen={showModal} maxWidth="2xl">
      <FormHeader
        title={`${editingContractor ? 'Edit' : 'Add'} Sub Contractor`}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={4}
          stepLabels={stepLabels}
        />
        
        <div className="mb-6">{renderFormStep()}</div>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? () => onStepChange(currentStep - 1) : undefined}
        onNext={currentStep < 4 ? () => onStepChange(currentStep + 1) : undefined}
        onSubmit={currentStep === 4 ? () => onSubmit(formData) : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 4}
        nextButtonText="Next"
        submitButtonText="Submit"
        showPrevious={true}
      />
    </FormContainer>
  );
};
