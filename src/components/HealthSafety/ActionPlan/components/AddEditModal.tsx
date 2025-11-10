import React from 'react';
import { FileText, File, Eye, X } from 'lucide-react';
import { AddEditModalProps } from '../types';
import { sections, sectionTypes } from '../utils/constants';
import { Calendar } from '../../../../utils/calendar/Calendar';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator,
  FormField,
  TextInput,
  Select,
  TextArea
} from '../../../../utils/form';

export const AddEditModal = ({
  isOpen,
  isEditing,
  actionPlan,
  onClose,
  onSave,
  onActionPlanChange,
  currentStep,
  onNextStep,
  onPrevStep,
  filePreviews,
  onFileUpload,
  onRemoveFile,
  uploadingFiles,
  editingId
}: AddEditModalProps) => {
  const stepLabels = ['Category', 'Item Details', 'Service & Attachments'];

  const handleSectionChange = (section: string) => {
    onActionPlanChange({
      ...actionPlan,
      section,
      type: sectionTypes[section]?.[0] || '' // Set first type as default
    });
  };

  return (
    <FormContainer isOpen={isOpen} maxWidth="4xl">
      <FormHeader 
        title={isEditing ? 'Edit Item' : 'Add New Item'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator 
          currentStep={currentStep}
          totalSteps={3}
          stepLabels={stepLabels}
        />

        {/* Step 1: Category */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <FormField label="Section" required>
              <Select
                value={actionPlan.section}
                onChange={(e) => handleSectionChange(e.target.value)}
                options={sections.map(section => ({ value: section, label: section }))}
              />
            </FormField>
          </div>
        )}

        {/* Step 2: Item Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Item" required>
                <TextInput
                  value={actionPlan.item || ''}
                  onChange={(e) =>
                    onActionPlanChange({ ...actionPlan, item: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Type" required>
                <Select
                  value={actionPlan.type || ''}
                  onChange={(e) =>
                    onActionPlanChange({ ...actionPlan, type: e.target.value })
                  }
                  options={sectionTypes[actionPlan.section || '']?.map((type) => ({
                    value: type,
                    label: type
                  })) || []}
                />
              </FormField>

              <FormField label="Description" description="(optional)">
                <TextInput
                  value={actionPlan.description || ''}
                  onChange={(e) =>
                    onActionPlanChange({ ...actionPlan, description: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Serials" description="(optional)">
                <TextInput
                  value={actionPlan.serials || ''}
                  onChange={(e) =>
                    onActionPlanChange({ ...actionPlan, serials: e.target.value })
                  }
                />
              </FormField>

              <div className="md:col-span-2">
                <FormField label="Notes" description="(optional)">
                  <TextArea
                    value={actionPlan.notes || ''}
                    onChange={(e) =>
                      onActionPlanChange({ ...actionPlan, notes: e.target.value })
                    }
                    rows={3}
                  />
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Service & Attachments */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Last Done">
                <Calendar
                  selectedDate={actionPlan.last_done || ''}
                  onDateSelect={(date) => {
                    console.log('Calendar date selected:', date); // Debug log
                    let updatedActionPlan = { ...actionPlan, last_done: date };
                    
                    // Calculate next due date if interval is set
                    if (date && actionPlan.interval_months) {
                      const lastDoneDate = new Date(date);
                      const months = parseInt(actionPlan.interval_months);
                      if (!isNaN(months)) {
                        const nextDueDate = new Date(lastDoneDate);
                        nextDueDate.setMonth(nextDueDate.getMonth() + months);
                        updatedActionPlan.next_due = nextDueDate.toISOString().split('T')[0];
                      }
                    }
                    
                    onActionPlanChange(updatedActionPlan);
                  }}
                  placeholder="Select last done date"
                  className="w-full"
                />
              </FormField>

              <FormField label="Interval Months" required>
                <TextInput
                  value={actionPlan.interval_months || ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^\d]/g, '');
                    let updatedActionPlan = { ...actionPlan, interval_months: numericValue };
                    
                    // Calculate next due date if last done is set
                    if (numericValue && actionPlan.last_done) {
                      const lastDoneDate = new Date(actionPlan.last_done);
                      const months = parseInt(numericValue);
                      if (!isNaN(months)) {
                        const nextDueDate = new Date(lastDoneDate);
                        nextDueDate.setMonth(nextDueDate.getMonth() + months);
                        updatedActionPlan.next_due = nextDueDate.toISOString().split('T')[0];
                      }
                    }
                    
                    onActionPlanChange(updatedActionPlan);
                  }}
                  placeholder="Enter number (e.g., 12 for 12 months)"
                />
              </FormField>
            </div>

              {/* Issue Reported Toggle Switch */}
              <div className="pt-2">
                <label className="flex items-center justify-start cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={!!actionPlan.issue}
                      onChange={(e) =>
                        onActionPlanChange({ ...actionPlan, issue: e.target.checked })
                      }
                    />
                    <div className={`block w-14 h-8 rounded-full ${actionPlan.issue ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${actionPlan.issue ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Issue Reported
                  </div>
                </label>
              </div>

              {/* File Upload Section */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachments <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="flex flex-col gap-2">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                      className="hidden"
                      id="file-upload"
                      onChange={onFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      {uploadingFiles ? (
                        <div className="flex flex-col items-center">
                          <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="mt-2 text-sm text-gray-500">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <FileText className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                            Click to upload files
                          </span>
                          <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                            Images, PDFs, Documents up to 10MB
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {filePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {filePreviews.map((preview) => (
                        <div key={preview.id} className="relative group">
                          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {preview.file && preview.file.type.startsWith('image/') ? (
                              <img
                                src={preview.url}
                                alt={preview.name}
                                className="w-full h-full object-cover"
                              />
                            ) : preview.isExisting && preview.url && (preview.url.includes('.jpg') || preview.url.includes('.jpeg') || preview.url.includes('.png')) ? (
                              <img
                                src={preview.url}
                                alt={preview.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <File className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex space-x-2">
                                <a
                                  href={preview.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                                >
                                  <Eye className="h-5 w-5 text-gray-600" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => onRemoveFile(preview.id)}
                                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                                >
                                  <X className="h-5 w-5 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                            {preview.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? onPrevStep : undefined}
        onNext={currentStep < 3 ? onNextStep : undefined}
        onSubmit={currentStep === 3 ? () => onSave(editingId || undefined) : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 3}
        submitButtonText={isEditing ? 'Save' : 'Add'}
      />
    </FormContainer>
  );
};
