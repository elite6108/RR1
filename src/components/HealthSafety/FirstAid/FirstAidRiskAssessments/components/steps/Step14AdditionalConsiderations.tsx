import React, { useCallback, useEffect } from 'react';
import { FormField, TextArea, TextInput } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Calendar, FileText, CheckCircle } from 'lucide-react';

export function Step14AdditionalConsiderations({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  // Calculate review date (365 days from assessment date)
  const calculateReviewDate = useCallback(() => {
    if (formData.assessmentDate) {
      const assessmentDate = new Date(formData.assessmentDate);
      const reviewDate = new Date(assessmentDate);
      reviewDate.setDate(reviewDate.getDate() + 365);
      return reviewDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    return '';
  }, [formData.assessmentDate]);

  // Auto-set review date when component mounts or assessment date changes
  useEffect(() => {
    const reviewDate = calculateReviewDate();
    if (reviewDate && formData.reviewDate !== reviewDate) {
      onDataChange({ reviewDate });
    }
  }, [calculateReviewDate, formData.reviewDate, onDataChange]);

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Additional considerations is optional, but if provided should have meaningful content
    if (formData.additionalConsiderations && formData.additionalConsiderations.trim().length > 0 && formData.additionalConsiderations.trim().length < 10) {
      stepErrors.additionalConsiderations = 'Please provide more detailed additional considerations (minimum 10 characters)';
    }

    // Review date should be automatically set, but validate it exists
    if (!formData.reviewDate) {
      stepErrors.reviewDate = 'Review date should be automatically calculated';
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData.additionalConsiderations, formData.reviewDate]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Additional Considerations
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Record any additional considerations, recommendations, or notes for this First Aid Needs Assessment.
        </p>
      </div>

      {/* Field 1: Additional Considerations Text Area */}
      <FormField
        label="Additional Considerations"
        description="Include any additional recommendations, special circumstances, or considerations not covered in previous steps"
        error={errors.additionalConsiderations}
      >
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <TextArea
            value={formData.additionalConsiderations || ''}
            onChange={(e) => onDataChange({ additionalConsiderations: e.target.value })}
            placeholder="e.g., Consider additional training for staff working with hazardous materials, review first aid provisions during peak business periods, coordinate with neighboring businesses for emergency response, ensure first aid equipment is accessible to disabled employees..."
            rows={6}
            maxLength={2000}
            className="pl-11"
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Optional field - {formData.additionalConsiderations?.length || 0}/2000 characters
        </div>
      </FormField>

      {/* Field 2: Review Date (Auto-calculated and Read-only) */}
      <FormField
        label="Review Date"
        description="Automatically set to 365 days from the assessment date"
        error={errors.reviewDate}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            value={formData.reviewDate || ''}
            readOnly
            className="pl-10 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            placeholder="Review date will be calculated automatically"
          />
        </div>
        {formData.reviewDate && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This assessment should be reviewed by: <strong>{formatDate(formData.reviewDate)}</strong>
          </div>
        )}
      </FormField>

      {/* Assessment Completion Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              Assessment Completion
            </h4>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
              <p>
                You have reached the final step of the First Aid Needs Assessment. Please review all previous steps to ensure accuracy and completeness.
              </p>
              <p>
                <strong>Next Steps:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Implement the recommendations identified in this assessment</li>
                <li>Ensure all first aid personnel are properly trained and certified</li>
                <li>Procure and position recommended first aid equipment and supplies</li>
                <li>Schedule regular reviews and updates to maintain compliance</li>
                <li>Set a reminder to review this assessment by the calculated review date</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Review Schedule Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Review Schedule
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>
                First Aid Needs Assessments should be reviewed annually or when significant changes occur to:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Workplace layout or operations</li>
                <li>Number of employees or working patterns</li>
                <li>Types of work activities or hazards</li>
                <li>First aid personnel or training requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
