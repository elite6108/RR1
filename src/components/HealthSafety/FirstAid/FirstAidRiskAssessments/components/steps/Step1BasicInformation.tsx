import React, { useCallback, useEffect } from 'react';
import { FormField, TextInput, DateInput } from '../../../../../../utils/form';
import { validateRequired, getTodayFormatted } from '../../../../../../utils/form';
import { supabase } from '../../../../../../lib/supabase';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';

export function Step1BasicInformation({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  // Generate assessment ID if not exists
  useEffect(() => {
    if (!formData.assessmentId) {
      // In a real implementation, this would come from the backend with proper sequential numbering
      // For now, generate a sequential ID starting from 00001
      const generateId = () => {
        // TODO: Replace with actual database query to get next sequential number
        // Example: SELECT COALESCE(MAX(CAST(SUBSTRING(assessment_id, 6) AS INTEGER)), 0) + 1 FROM first_aid_needs_assessments
        const sequentialNumber = 1; // This should be fetched from database as next available number
        const paddedNumber = sequentialNumber.toString().padStart(5, '0');
        return `FANA-${paddedNumber}`;
      };
      
      // Get current user's display name from auth context
      const getCurrentUserDisplayName = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          return user?.user_metadata?.display_name || 
                 user?.user_metadata?.full_name || 
                 user?.email || 
                 'Unknown User';
        } catch (error) {
          console.error('Error fetching user profile:', error);
          return 'Unknown User';
        }
      };
      
      // Set the initial data with ID and date, then fetch user name
      const initialData = {
        assessmentId: generateId(),
        assessmentDate: getTodayFormatted()
      };
      
      onDataChange(initialData);
      
      // Fetch and set the assessor name asynchronously
      getCurrentUserDisplayName().then(displayName => {
        onDataChange({
          assessorName: displayName
        });
      });
    }
  }, [formData.assessmentId, onDataChange]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({
      assessmentTitle: e.target.value
    });
  };

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate assessment title (required)
    const titleError = validateRequired(formData.assessmentTitle, 'Assessment Title');
    if (titleError) {
      stepErrors.assessmentTitle = titleError;
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData.assessmentTitle]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      // Store validation function reference
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          First Aid Needs Details
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Basic information about this First Aid Needs Assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Field 1: Assessment ID (Auto-generated, Disabled) */}
        <FormField
          label="Assessment ID"
          description="Automatically generated unique identifier"
        >
          <TextInput
            value={formData.assessmentId || ''}
            onChange={() => {}} // No-op since it's disabled
            disabled={true}
            className="bg-gray-50 dark:bg-gray-800"
          />
        </FormField>

        {/* Field 2: Date (Auto-populated, Disabled unless editing) */}
        <FormField
          label="Assessment Date"
          description="Date this assessment was created"
        >
          <DateInput
            value={formData.assessmentDate || ''}
            onChange={() => {}} // No-op since it's disabled for new assessments
            disabled={true}
            className="bg-gray-50 dark:bg-gray-800"
          />
        </FormField>
      </div>

      {/* Field 3: Assessment Title (Required) */}
      <FormField
        label="First Aid Needs Assessment Title"
        required={true}
        error={errors.assessmentTitle}
        description="Enter a descriptive title for this assessment"
      >
        <TextInput
          value={formData.assessmentTitle || ''}
          onChange={handleTitleChange}
          placeholder="e.g., Main Office Building - Annual First Aid Needs Assessment"
          maxLength={200}
        />
      </FormField>

      {/* Field 4: Assessor Name (Auto-populated from logged-in user, Disabled) */}
      <FormField
        label="Person carrying out assessment"
        description="Name of the person conducting this assessment"
      >
        <TextInput
          value={formData.assessorName || ''}
          onChange={() => {}} // No-op since it's disabled
          disabled={true}
          className="bg-gray-50 dark:bg-gray-800"
        />
      </FormField>
    </div>
  );
}
