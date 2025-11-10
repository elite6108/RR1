import React, { useCallback, useEffect, useState } from 'react';
import { FormField, TextInput, ModernCheckboxGroup } from '../../../../../../utils/form';
import { validateRequired } from '../../../../../../utils/form';
import type { FirstAidNeedsAssessmentStepProps } from '../../types';
import { Package, MapPin, User, Plus, X, Shield, Heart, Car, Eye, Zap, Droplets, Building2 } from 'lucide-react';

// Icon mapping for safe serialization
const iconMap = {
  Shield,
  Package,
  Car,
  Eye,
  Heart,
  Droplets,
  Building2
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Package;
};

interface FirstAidResource {
  id: string;
  location: string;
  personResponsible: string;
}

export function Step13FirstAidResourcesPart2({ 
  formData, 
  errors, 
  onDataChange,
  onValidate 
}: FirstAidNeedsAssessmentStepProps) {

  const [customCategory, setCustomCategory] = useState('');
  const [newResources, setNewResources] = useState<{
    [key: string]: { location: string; personResponsible: string };
  }>({});

  const handleResourceCategoriesChange = (selectedValues: string[]) => {
    onDataChange({
      resourceCategories: selectedValues,
      // Clear resource lists for unselected categories
      ...Object.fromEntries(
        [...resourceCategoryOptions, ...(formData.customResourceCategories || [])].map(category => [
          `${category.value}Resources`,
          selectedValues.includes(category.value) ? formData[`${category.value}Resources`] || [] : []
        ])
      )
    });
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !formData.customResourceCategories?.some(cat => cat.label === customCategory.trim())) {
      const currentCustom = formData.customResourceCategories || [];
      const categoryValue = customCategory.trim().replace(/\s+/g, '').toLowerCase();
      const newCustomCategory = {
        value: categoryValue,
        label: customCategory.trim(),
        description: `Custom ${customCategory.trim().toLowerCase()} resources`,
        icon: Package,
        iconName: 'Package'
      };
      
      onDataChange({
        customResourceCategories: [...currentCustom, newCustomCategory],
        [`${categoryValue}Resources`]: []
      });
      setCustomCategory('');
    }
  };

  const handleRemoveCustomCategory = (categoryToRemove: string) => {
    const currentCustom = formData.customResourceCategories || [];
    const newCustom = currentCustom.filter(cat => cat.value !== categoryToRemove);
    
    onDataChange({
      customResourceCategories: newCustom,
      [`${categoryToRemove}Resources`]: undefined,
      // Also remove from selected categories
      resourceCategories: (formData.resourceCategories || []).filter(cat => cat !== categoryToRemove)
    });
  };

  const handleAddResource = (categoryValue: string) => {
    const newResource = newResources[categoryValue];
    if (newResource?.location.trim()) {
      const currentList = formData[`${categoryValue}Resources`] || [];
      const resource: FirstAidResource = {
        id: `${categoryValue}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        location: newResource.location.trim(),
        personResponsible: newResource.personResponsible.trim()
      };
      
      onDataChange({
        [`${categoryValue}Resources`]: [...currentList, resource]
      });

      // Clear the input fields
      setNewResources(prev => ({
        ...prev,
        [categoryValue]: { location: '', personResponsible: '' }
      }));
    }
  };

  const handleRemoveResource = (categoryValue: string, idToRemove: string) => {
    const currentList = formData[`${categoryValue}Resources`] || [];
    const updatedList = currentList.filter((resource: FirstAidResource) => resource.id !== idToRemove);
    onDataChange({
      [`${categoryValue}Resources`]: updatedList
    });
  };

  const handleNewResourceChange = (categoryValue: string, field: 'location' | 'personResponsible', value: string) => {
    setNewResources(prev => ({
      ...prev,
      [categoryValue]: {
        ...prev[categoryValue] || { location: '', personResponsible: '' },
        [field]: value
      }
    }));
  };

  // Validation function for this step
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string | undefined> = {};

    // Validate resource categories selection
    const hasSelectedCategories = formData.resourceCategories && formData.resourceCategories.length > 0;
    if (!hasSelectedCategories) {
      stepErrors.resourceCategories = 'Please select applicable first aid resource categories';
    }

    // Validate that each selected category has at least one resource
    if (formData.resourceCategories) {
      formData.resourceCategories.forEach(category => {
        const resourcesKey = `${category}Resources`;
        const resources = formData[resourcesKey] || [];
        if (resources.length === 0) {
          stepErrors[resourcesKey] = 'Please add at least one resource for this category';
        }
      });
    }

    const isValid = Object.keys(stepErrors).length === 0;
    return { isValid, errors: stepErrors };
  }, [formData.resourceCategories, formData]);

  // Update validation function reference
  useEffect(() => {
    if (onValidate) {
      (onValidate as any).current = validateStep;
    }
  }, [validateStep, onValidate]);

  const resourceCategoryOptions = [
    {
      value: 'dampDustProofContainer',
      label: 'Damp and dust proof First Aid container',
      description: 'Weatherproof first aid storage',
      icon: Shield,
      iconName: 'Shield',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      value: 'firstAidKits',
      label: 'First Aid Kits',
      description: 'Standard workplace first aid kits',
      icon: Package,
      iconName: 'Package',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      value: 'travelFirstAidKits',
      label: 'Travel First Aid Kits',
      description: 'Portable kits for mobile workers',
      icon: Car,
      iconName: 'Car',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      value: 'eyewashStations',
      label: 'Eyewash Stations',
      description: 'Emergency eye irrigation facilities',
      icon: Eye,
      iconName: 'Eye',
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      value: 'defibrillator',
      label: 'Defibrillator',
      description: 'Automated External Defibrillator (AED)',
      icon: Heart,
      iconName: 'Heart',
      color: 'text-red-600 dark:text-red-400'
    },
    {
      value: 'emergencyShower',
      label: 'Emergency Shower',
      description: 'Emergency decontamination shower',
      icon: Droplets,
      iconName: 'Droplets',
      color: 'text-blue-500 dark:text-blue-300'
    },
    {
      value: 'firstAidRoom',
      label: 'First Aid Room',
      description: 'Dedicated first aid treatment room',
      icon: Building2,
      iconName: 'Building2',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const selectedCategories = formData.resourceCategories || [];
  const customCategories = (formData.customResourceCategories || []).map(category => ({
    ...category,
    icon: getIconComponent(category.iconName || 'Package')
  }));
  const allCategories = [...resourceCategoryOptions, ...customCategories];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          First Aid Resources - Part 2
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          List all first aid items along with their location and person responsible for checking.
        </p>
      </div>

      {/* Resource Categories Selection */}
      <FormField
        label="Select the first aid resource categories available at your workplace:"
        required={true}
        error={errors.resourceCategories}
      >
        <ModernCheckboxGroup
          options={allCategories}
          selectedValues={selectedCategories}
          onChange={handleResourceCategoriesChange}
          layout="grid"
        />
      </FormField>

      {/* Add Custom Category Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Add Custom Resource Category
        </h4>
        <div className="flex gap-2">
          <TextInput
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Enter custom resource category..."
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleAddCustomCategory}
            disabled={!customCategory.trim()}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {/* Display Custom Categories */}
        {customCategories.length > 0 && (
          <div className="mt-3 space-y-2">
            {customCategories.map((category) => (
              <div key={category.value} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded p-2">
                <span className="text-sm text-gray-900 dark:text-white">{category.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomCategory(category.value)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resource Management for Selected Categories */}
      {selectedCategories.map((categoryValue) => {
        const category = allCategories.find(c => c.value === categoryValue);
        if (!category) return null;

        const Icon = category.icon;
        const resources = formData[`${categoryValue}Resources`] || [];
        const newResource = newResources[categoryValue] || { location: '', personResponsible: '' };

        return (
          <div key={categoryValue} className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon className={`h-5 w-5 ${category.color}`} />
                {category.label}
              </h4>

              {/* Add New Resource Form */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Add New Resource
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <TextInput
                        value={newResource.location}
                        onChange={(e) => handleNewResourceChange(categoryValue, 'location', e.target.value)}
                        placeholder="Location"
                        className="pl-10"
                        maxLength={100}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <TextInput
                        value={newResource.personResponsible}
                        onChange={(e) => handleNewResourceChange(categoryValue, 'personResponsible', e.target.value)}
                        placeholder="Person Responsible"
                        className="pl-10"
                        maxLength={100}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => handleAddResource(categoryValue)}
                      disabled={!newResource.location.trim()}
                      className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Resource
                    </button>
                  </div>
                </div>
              </div>

              {/* Resources List */}
              {resources.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Resources ({resources.length}):
                  </h5>
                  {resources.map((resource: FirstAidResource, index: number) => (
                    <div key={resource.id} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[20px]">
                          #{index + 1}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white font-medium">
                              {resource.location}
                            </span>
                          </div>
                          {resource.personResponsible && (
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {resource.personResponsible}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(categoryValue, resource.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Validation Error for Resource List */}
              {errors[`${categoryValue}Resources`] && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {errors[`${categoryValue}Resources`]}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
