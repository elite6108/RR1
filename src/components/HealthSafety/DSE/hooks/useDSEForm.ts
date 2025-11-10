import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { DSEFormData, DSEFormHookResult, ImageOption } from '../types';
import { INITIAL_FORM_DATA, getStepByNumber } from '../utils/constants';
import { HelpCircle, Info } from 'lucide-react';
import React from 'react';

export const useDSEForm = (): DSEFormHookResult => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DSEFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) {
        setFormData((prev) => ({
          ...prev,
          full_name: user.user_metadata.display_name,
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.full_name.trim()) {
      errors.push('Full name is required');
    }
    
    if (!formData.keyboard_posture) {
      errors.push('Please select your keyboard posture');
    }
    
    if (!formData.mouse_position) {
      errors.push('Please select your mouse position');
    }
    
    if (!formData.chair_posture) {
      errors.push('Please select your chair posture');
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      // Validate form before submission
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        alert(`Please complete the following required fields:\n\n${validationErrors.join('\n')}`);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        return;
      }

      // First, check if an assessment already exists for this user
      const { data: existingAssessment } = await supabase
        .from('dse_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let error;
      if (existingAssessment) {
        // Update existing assessment
        const { error: updateError } = await supabase
          .from('dse_assessments')
          .update({
            ...formData,
            submitted_date: new Date().toISOString(),
            next_due_date: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(), // 1 year from now
          })
          .eq('id', existingAssessment.id);
        error = updateError;
      } else {
        // Insert new assessment
        const { error: insertError } = await supabase
          .from('dse_assessments')
          .insert([
            {
              ...formData,
              user_id: user.id,
              submitted_date: new Date().toISOString(),
              next_due_date: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000
              ).toISOString(), // 1 year from now
            },
          ]);
        error = insertError;
      }

      if (error) {
        console.error('Error submitting DSE assessment:', error);
        // Show error message to user
        alert(`Error submitting DSE assessment: ${error.message}`);
        return;
      }
    } catch (error) {
      console.error('Error submitting DSE assessment:', error);
      // Show error message to user
      alert(
        `Error submitting DSE assessment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const renderYesNoQuestion = (
    label: string,
    value: boolean | null,
    onChange: (value: boolean) => void,
    tip?: string
  ): JSX.Element => (
    React.createElement('div', { className: 'space-y-2' }, [
      React.createElement('label', { 
        key: 'label',
        className: 'block text-sm font-medium text-gray-700' 
      }, `${label} *`),
      React.createElement('div', { 
        key: 'buttons',
        className: 'flex space-x-4' 
      }, [
        React.createElement('button', {
          key: 'yes',
          type: 'button',
          onClick: () => onChange(true),
          className: `px-4 py-2 rounded-md ${
            value === true
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`
        }, 'Yes'),
        React.createElement('button', {
          key: 'no',
          type: 'button',
          onClick: () => onChange(false),
          className: `px-4 py-2 rounded-md ${
            value === false
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`
        }, 'No')
      ]),
      tip && React.createElement('div', {
        key: 'tip',
        className: 'flex items-start mt-2 text-sm text-gray-500'
      }, [
        React.createElement(HelpCircle, {
          key: 'icon',
          className: 'h-4 w-4 mr-1 mt-0.5 flex-shrink-0'
        }),
        React.createElement('span', { key: 'text' }, tip)
      ])
    ])
  );

  const renderImageSelection = (
    label: string,
    images: ImageOption[],
    selectedImage: string,
    onChange: (imageId: string) => void,
    tip?: string
  ): JSX.Element => (
    React.createElement('div', { className: 'space-y-2' }, [
      React.createElement('label', { 
        key: 'label',
        className: 'block text-sm font-medium text-gray-700' 
      }, `${label} *`),
      React.createElement('div', { 
        key: 'grid',
        className: 'grid grid-cols-2 gap-4' 
      }, images.map((image) => 
        React.createElement('button', {
          key: image.id,
          type: 'button',
          onClick: () => onChange(image.id),
          className: `p-4 border rounded-lg ${
            selectedImage === image.id
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }`
        }, React.createElement('div', {
          className: 'text-sm text-gray-700'
        }, image.label))
      )),
      tip && React.createElement('div', {
        key: 'tip',
        className: 'flex items-start mt-2 text-sm text-gray-500'
      }, [
        React.createElement(Info, {
          key: 'icon',
          className: 'h-4 w-4 mr-1 mt-0.5 flex-shrink-0'
        }),
        React.createElement('span', { key: 'text' }, tip)
      ])
    ])
  );

  const getStepLabel = (): string => {
    const step = getStepByNumber(currentStep);
    return step?.label || '';
  };

  return {
    currentStep,
    formData,
    setCurrentStep,
    setFormData,
    handleSubmit,
    fetchUserProfile,
    renderYesNoQuestion,
    renderImageSelection,
    getStepLabel,
  };
};
