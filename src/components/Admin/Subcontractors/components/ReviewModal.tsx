import React from 'react';
import { Subcontractor, ReviewFormData } from '../types';
import { Calendar } from '../../../../utils/calendar/Calendar';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput,
  TextArea
} from '../../../../utils/form';

interface ReviewModalProps {
  showModal: boolean;
  contractor: Subcontractor | null;
  reviewFormData: ReviewFormData;
  submittingReview: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: () => void;
  onReviewChange: (field: keyof ReviewFormData, value: any) => void;
  onSatisfactionChange: (field: keyof ReviewFormData, rating: string, comments?: string) => void;
  onRequirementsChange: (value: string) => void;
  onDateChange: (value: string) => void;
}

export const ReviewModal = ({
  showModal,
  contractor,
  reviewFormData,
  submittingReview,
  submitError,
  onClose,
  onSubmit,
  onReviewChange,
  onSatisfactionChange,
  onRequirementsChange,
  onDateChange,
}) => {
  if (!showModal || !contractor) return null;

  return (
    <FormContainer isOpen={showModal} maxWidth="4xl">
      <FormHeader
        title={`Review for ${contractor?.company_name}`}
        onClose={onClose}
      />
      
      <FormContent>
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <div className="space-y-6">
          {/* Date and Text Inputs */}
          <div className="space-y-4">
            <FormField label="Date" required>
              <Calendar
                selectedDate={reviewFormData.date}
                onDateSelect={onDateChange}
                isDisabled={(date) => date > new Date()}
                placeholder="Select review date"
                className="mt-1"
              />
            </FormField>

            <FormField label="Details of your requirements and scope of contract" required>
              <TextArea
                value={reviewFormData.requirements_scope}
                onChange={(e) => onRequirementsChange(e.target.value)}
                rows={3}
              />
            </FormField>

            <FormField label="What was the agreed timeframe for completion of the project?" required>
              <TextInput
                value={reviewFormData.agreed_timeframe}
                onChange={(e) => onReviewChange('agreed_timeframe', e.target.value)}
              />
            </FormField>

            <FormField label="What was the total time taken to complete the project?" required>
              <TextInput
                value={reviewFormData.total_time_taken}
                onChange={(e) => onReviewChange('total_time_taken', e.target.value)}
              />
            </FormField>
          </div>

            {/* Satisfaction Ratings - Mobile Friendly */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Satisfaction Ratings</h4>
              {[
                {
                  key: 'quality_rating',
                  label: 'Overall quality of delivered project',
                },
                {
                  key: 'timeliness_rating',
                  label: 'Timeliness of project delivery',
                },
                {
                  key: 'communication_rating',
                  label: 'Communication throughout the project',
                },
                {
                  key: 'understanding_rating',
                  label: 'Contractors understanding of your needs',
                },
                {
                  key: 'cooperativeness_rating',
                  label:
                    'Cooperativeness of the Contractor in dealing with any issues or complaints',
                },
                {
                  key: 'overall_satisfaction_rating',
                  label: 'Overall satisfaction with the contractor',
                },
              ].map(({ key, label }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">{label}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { value: 'totally_dissatisfied', label: 'Totally dissatisfied' },
                      { value: 'mostly_dissatisfied', label: 'Mostly dissatisfied' },
                      { value: 'neither', label: 'Neither' },
                      { value: 'mostly_satisfied', label: 'Mostly satisfied' },
                      { value: 'totally_satisfied', label: 'Totally satisfied' },
                    ].map(({ value, label: ratingLabel }) => (
                      <button
                        key={value}
                        onClick={() =>
                          onSatisfactionChange(
                            key as keyof ReviewFormData,
                            value
                          )
                        }
                        className={`
                          px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors text-center
                          ${
                            (reviewFormData[key as keyof ReviewFormData] as any)
                              ?.rating === value
                              ? value.includes('dissatisfied')
                                ? 'bg-red-100 text-red-800 border-2 border-red-500'
                                : value === 'neither'
                                ? 'bg-gray-100 text-gray-800 border-2 border-gray-500'
                                : 'bg-green-100 text-green-800 border-2 border-green-500'
                              : 'bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        {ratingLabel}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Safety and Compliance Checklist */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Safety and Compliance Checklist
              </h4>
              {[
                {
                  key: 'authority_to_work',
                  label:
                    'Is an authority to work document in place and on the job?',
                },
                {
                  key: 'relevant_permits',
                  label: 'Are relevant permits in place?',
                },
                {
                  key: 'risk_assessments',
                  label:
                    'Are necessary risk assessments available and on the job?',
                },
                {
                  key: 'documents_legible',
                  label:
                    'Are the authority to work, associated documents legible?',
                },
                {
                  key: 'time_limit_clear',
                  label:
                    'Is the operational time limit of the authority to work and permits clear?',
                },
                {
                  key: 'control_measures',
                  label:
                    "Are control measures in place as stated within the RAM's?",
                },
                {
                  key: 'work_in_line',
                  label:
                    'Is the work carried out in line with the authority to work?',
                },
                {
                  key: 'right_people',
                  label: 'Are the right people carrying out the task?',
                },
                {
                  key: 'emergency_knowledge',
                  label:
                    'Do people know what to do in the event of emergency? (ASK)',
                },
                {
                  key: 'ppe_condition',
                  label:
                    'Is the personal protective equipment (PPE) in use and in good order',
                },
                {
                  key: 'tools_condition',
                  label:
                    'Are tools and equipment suitable and in good condition?',
                },
                {
                  key: 'housekeeping_standards',
                  label: 'Are housekeeping standards satisfactory?',
                },
              ].map(({ key, label }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col space-y-3">
                    <span className="text-sm text-gray-700 font-medium">{label}</span>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() =>
                          onReviewChange(key as keyof ReviewFormData, true)
                        }
                        className={`
                          px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none
                          ${
                            reviewFormData[key as keyof ReviewFormData] === true
                              ? 'bg-green-100 text-green-800 border-2 border-green-500'
                              : 'bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-green-300'
                          }
                        `}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() =>
                          onReviewChange(key as keyof ReviewFormData, false)
                        }
                        className={`
                          px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none
                          ${
                            reviewFormData[key as keyof ReviewFormData] ===
                            false
                              ? 'bg-red-100 text-red-800 border-2 border-red-500'
                              : 'bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-red-300'
                          }
                        `}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={onSubmit}
        isLastStep={true}
        submitButtonText={submittingReview ? 'Saving...' : 'Save Review'}
        disabled={submittingReview}
        loading={submittingReview}
        showPrevious={false}
      />
    </FormContainer>
  );
};
