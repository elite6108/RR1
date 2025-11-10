import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { VehicleFormStepOne } from './VehicleFormStepOne';
import { VehicleFormStepTwo } from './VehicleFormStepTwo';
import { VehicleFormStepThree } from './VehicleFormStepThree';
import { useStaffUsers } from '../hooks/useStaffUsers';
import { callDVLAAPI, callMOTAPI } from '../utils/vehicleAPI';
import type { VehicleFormProps } from '../types';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter, 
  StepIndicator 
} from '../../../../../utils/form';

export function VehicleForm({ onClose, onSuccess, vehicleToEdit }: VehicleFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { combinedStaffUsers } = useStaffUsers(false);
  const [formData, setFormData] = useState({
    vin: (vehicleToEdit as any)?.vin || '',
    registration: vehicleToEdit?.registration || '',
    driver_id: (vehicleToEdit as any)?.driver_id || '',
    driver: '',
    mot_date: vehicleToEdit?.mot_date || '',
    tax_date: vehicleToEdit?.tax_date || '',
    service_date: vehicleToEdit?.service_date || '',
    insurance_date: vehicleToEdit?.insurance_date || '',
    breakdown_date: vehicleToEdit?.breakdown_date || '',
    has_congestion: (vehicleToEdit as any)?.has_congestion || false,
    has_dartford: (vehicleToEdit as any)?.has_dartford || false,
    has_clean_air: (vehicleToEdit as any)?.has_clean_air || false,
    service_interval_value: (vehicleToEdit as any)?.service_interval_value || '',
    service_interval_unit: (vehicleToEdit as any)?.service_interval_unit || 'Miles',
    notes: (vehicleToEdit as any)?.notes || '',
    ulez: (vehicleToEdit as any)?.ulez || '',
    last_service_date: (vehicleToEdit as any)?.last_service_date || ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === 'driver_id' && value) {
      const selectedStaff = combinedStaffUsers.find(s => s.original_id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        driver: selectedStaff?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleSubmit = async () => {
    console.log('Form submitted explicitly'); // Debug log
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Call DVLA VES API to get MOT and TAX information
      const dvlaResult = await callDVLAAPI(formData.registration);
      
      let motDate = formData.mot_date;
      let taxDate = formData.tax_date;
      let make = vehicleToEdit?.make || '';
      let model = vehicleToEdit?.model || '';
      let apiMessages = [];
      
      if (dvlaResult.success && dvlaResult.data) {
        // Update MOT and TAX dates from DVLA API
        if (dvlaResult.data.motExpiryDate) {
          motDate = dvlaResult.data.motExpiryDate;
        }
        if (dvlaResult.data.taxDueDate) {
          taxDate = dvlaResult.data.taxDueDate;
        }
        
        // Update make from DVLA API
        if (dvlaResult.data.make) {
          make = dvlaResult.data.make;
        }
        apiMessages.push('DVLA data retrieved successfully');
      } else if (dvlaResult.error === 'CORS_ERROR') {
        apiMessages.push('DVLA API: CORS error (requires backend service)');
      } else {
        apiMessages.push(`DVLA API error: ${dvlaResult.message || dvlaResult.error}`);
      }

      // Call MOT API to get model information
      const motResult = await callMOTAPI(formData.registration);
      if (motResult.success && motResult.data) {
        if (motResult.data.model) {
          model = motResult.data.model;
        }
        apiMessages.push('MOT model data retrieved successfully');
      } else if (motResult.error === 'CORS_ERROR') {
        apiMessages.push('MOT API: CORS error (requires backend service)');
      } else {
        apiMessages.push(`MOT API error: ${motResult.message || motResult.error}`);
      }
      
      const finalApiMessage = `Vehicle saved successfully. ${apiMessages.join(', ')}`;

      // Ensure driver field is never null - use a default value if no driver is selected
      let driverName = formData.driver || 'Unassigned';
      
      if (formData.driver_id) {
        const selectedStaff = combinedStaffUsers.find(s => s.original_id === formData.driver_id);
        if (selectedStaff) {
          driverName = selectedStaff.name;
        }
      }

      let error;
      if (vehicleToEdit) {
        ({ error } = await supabase
          .from('vehicles')
          .update({
            ...formData,
            vin: formData.vin || null,
            make: make,
            model: model,
            driver_id: formData.driver_id || null,
            driver: driverName, // Always provide a value, never null
            mot_date: motDate || null,
            tax_date: taxDate || null,
            service_date: formData.service_date || null,
            insurance_date: formData.insurance_date || null,
            breakdown_date: formData.breakdown_date || null,
            service_interval_value: formData.service_interval_value || null,
            notes: formData.notes || null,
            ulez: formData.ulez || null,
            last_service_date: formData.last_service_date || null
          })
          .eq('id', vehicleToEdit.id));
      } else {
        ({ error } = await supabase
          .from('vehicles')
          .insert([{
            ...formData,
            user_id: user.id,
            vin: formData.vin || null,
            make: make,
            model: model,
            driver_id: formData.driver_id || null,
            driver: driverName, // Always provide a value, never null
            mot_date: motDate || null,
            tax_date: taxDate || null,
            service_date: formData.service_date || null,
            insurance_date: formData.insurance_date || null,
            breakdown_date: formData.breakdown_date || null,
            service_interval_value: formData.service_interval_value || null,
            notes: formData.notes || null,
            ulez: formData.ulez || null,
            last_service_date: formData.last_service_date || null
          }]));
      }

      if (error) throw error;
      
      // Show success message with API status
      console.log(finalApiMessage);
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    console.log('Next step clicked, current step:', currentStep); // Debug log
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    console.log('Previous step clicked, current step:', currentStep); // Debug log
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Debug effect to track step changes
  useEffect(() => {
    console.log('Current step changed to:', currentStep);
  }, [currentStep]);

  const stepLabels = [
    'Vehicle Information',
    'Service & Insurance Details', 
    'Additional Information'
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <VehicleFormStepOne
            formData={formData}
            combinedStaffUsers={combinedStaffUsers}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <VehicleFormStepTwo
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 3:
        return (
          <VehicleFormStepThree
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader 
        title={vehicleToEdit ? 'Edit Vehicle' : 'New Vehicle'} 
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator 
          currentStep={currentStep}
          totalSteps={3}
          stepLabels={stepLabels}
        />

        <form className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-md">
              <div className="flex-shrink-0">⚠️</div>
              <p>{error}</p>
            </div>
          )}

          {renderStep()}
        </form>
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? handlePrevStep : undefined}
        onNext={currentStep < 3 ? handleNextStep : undefined}
        onSubmit={currentStep === 3 ? handleSubmit : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 3}
        submitButtonText={loading ? 'Saving...' : vehicleToEdit ? 'Save Changes' : 'Add Vehicle'}
        disabled={loading}
        loading={loading}
      />
    </FormContainer>
  );
}
