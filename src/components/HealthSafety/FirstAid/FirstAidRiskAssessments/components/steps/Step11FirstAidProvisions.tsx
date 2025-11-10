import React, { useCallback, useEffect, useState } from 'react';
import { FormField, TextInput, ModernRadioGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Users, Plus, X, Phone, User, Heart, Shield, Brain } from 'lucide-react';

interface FirstAider {
  id: string;
  fullName: string;
  phone: string;
}

export function Step11FirstAidProvisions({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const [newFirstAiders, setNewFirstAiders] = useState<{
    appointedPerson: { fullName: string; phone: string };
    efawFirstAider: { fullName: string; phone: string };
    fawFirstAider: { fullName: string; phone: string };
    additionalTrainingFirstAider: { fullName: string; phone: string };
    mentalHealthFirstAider: { fullName: string; phone: string };
  }>({
    appointedPerson: { fullName: '', phone: '' },
    efawFirstAider: { fullName: '', phone: '' },
    fawFirstAider: { fullName: '', phone: '' },
    additionalTrainingFirstAider: { fullName: '', phone: '' },
    mentalHealthFirstAider: { fullName: '', phone: '' }
  });

  const handleAddFirstAider = (type: string) => {
    const newPerson = newFirstAiders[type as keyof typeof newFirstAiders];
    if (newPerson.fullName.trim()) {
      const currentList = formData[`${type}List`] || [];
      const newFirstAider: FirstAider = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fullName: newPerson.fullName.trim(),
        phone: newPerson.phone.trim()
      };
      
      onDataChange({
        [`${type}List`]: [...currentList, newFirstAider]
      });

      // Clear the input fields
      setNewFirstAiders(prev => ({
        ...prev,
        [type]: { fullName: '', phone: '' }
      }));
    }
  };

  const handleRemoveFirstAider = (type: string, idToRemove: string) => {
    const currentList = formData[`${type}List`] || [];
    const updatedList = currentList.filter((person: FirstAider) => person.id !== idToRemove);
    onDataChange({
      [`${type}List`]: updatedList
    });
  };

  const handleNewFirstAiderChange = (type: string, field: 'fullName' | 'phone', value: string) => {
    setNewFirstAiders(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [field]: value
      }
    }));
  };

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate each first aider type
    const firstAiderTypes = [
      'hasAppointedPerson',
      'hasEfawFirstAider', 
      'hasFawFirstAider',
      'hasAdditionalTrainingFirstAider',
      'hasMentalHealthFirstAider'
    ];

    firstAiderTypes.forEach(type => {
      const error = validateRequired(formData[type], type.replace('has', '').replace(/([A-Z])/g, ' $1').toLowerCase());
      if (error) {
        stepErrors[type] = error;
      }

      // If "yes" is selected, validate that at least one person is added
      if (formData[type] === 'yes') {
        const listKey = type.replace('has', '').charAt(0).toLowerCase() + type.replace('has', '').slice(1) + 'List';
        const list = formData[listKey] || [];
        if (list.length === 0) {
          stepErrors[listKey] = 'Please add at least one person for this role';
        }
      }
    });

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  const firstAiderTypes = [
    {
      key: 'appointedPerson',
      hasKey: 'hasAppointedPerson',
      title: 'Appointed Person(s)',
      description: 'Responsible for administering first aid and calling emergency services',
      icon: Shield,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      key: 'efawFirstAider',
      hasKey: 'hasEfawFirstAider',
      title: 'Emergency First Aiders (EFAW)',
      description: 'Qualified Emergency First Aid at Work personnel',
      icon: Users,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      key: 'fawFirstAider',
      hasKey: 'hasFawFirstAider',
      title: 'First Aider (FAW)',
      description: 'Qualified First Aid at Work personnel',
      icon: Heart,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      key: 'additionalTrainingFirstAider',
      hasKey: 'hasAdditionalTrainingFirstAider',
      title: 'First aider with additional training',
      description: 'First aiders with specialized or advanced training',
      icon: User,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      key: 'mentalHealthFirstAider',
      hasKey: 'hasMentalHealthFirstAider',
      title: 'Mental Health First Aider',
      description: 'Qualified Mental Health First Aid personnel',
      icon: Brain,
      color: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          First Aid Provisions
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Identify the first aid personnel available at your workplace and their contact information.
        </p>
      </div>

      {firstAiderTypes.map((type) => {
        const Icon = type.icon;
        const hasPersonnel = formData[type.hasKey] === 'yes';
        const personnelList = formData[`${type.key}List`] || [];
        const newPerson = newFirstAiders[type.key as keyof typeof newFirstAiders];

        return (
          <div key={type.key} className="space-y-4">
            {/* Yes/No Question */}
            <FormField
              label={type.title}
              description={type.description}
              required={true}
              error={errors[type.hasKey]}
            >
              <ModernRadioGroup
                options={yesNoOptions}
                selectedValue={formData[type.hasKey] || ''}
                onChange={(value) => onDataChange({ 
                  [type.hasKey]: value,
                  // Clear personnel list if "no" is selected
                  [`${type.key}List`]: value === 'no' ? [] : formData[`${type.key}List`]
                })}
                layout="horizontal"
              />
            </FormField>

            {/* Personnel Management Section */}
            {hasPersonnel && (
              <div className="ml-4 space-y-4">
                {/* Add New Person Form */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${type.color}`} />
                    Add {type.title.replace('(s)', '').replace(/\([^)]*\)/g, '').trim()}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <TextInput
                          value={newPerson.fullName}
                          onChange={(e) => handleNewFirstAiderChange(type.key, 'fullName', e.target.value)}
                          placeholder="Full Name"
                          className="pl-10"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <TextInput
                          value={newPerson.phone}
                          onChange={(e) => handleNewFirstAiderChange(type.key, 'phone', e.target.value)}
                          placeholder="Phone (optional)"
                          className="pl-10"
                          maxLength={20}
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleAddFirstAider(type.key)}
                        disabled={!newPerson.fullName.trim()}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personnel List */}
                {personnelList.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current {type.title}:
                    </h5>
                    {personnelList.map((person: FirstAider) => (
                      <div key={person.id} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${type.color}`} />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {person.fullName}
                            </div>
                            {person.phone && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {person.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveFirstAider(type.key, person.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Validation Error for Personnel List */}
                {errors[`${type.key}List`] && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors[`${type.key}List`]}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
