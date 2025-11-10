import React, { useState } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { AlertTriangle } from 'lucide-react';
import { useStaffUsers } from '../../shared/hooks/useStaffUsers';
import { 
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator,
  FormField,
  ModernRadioGroup,
  TextInput,
  DateInput,
  NumberInput,
  Select
} from '../../../../../utils/form';
import type { DriverFormProps, CombinedStaffUser } from '../../shared/types';

export function DriverForm({ onClose, onSuccess, selectedStaff, driverToEdit }: DriverFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { combinedStaffUsers } = useStaffUsers(true);
  const [isNewDriver, setIsNewDriver] = useState(!!driverToEdit?.full_name);
  const [formData, setFormData] = useState({
    staff_id: driverToEdit?.staff_id || selectedStaff?.id || '',
    full_name: driverToEdit?.full_name || '',
    licence_number: driverToEdit?.licence_number || '',
    licence_expiry: driverToEdit?.licence_expiry || '',
    last_check: driverToEdit?.last_check || '',
    points: driverToEdit?.points || 0,
  });

  // When editing, we need to include the current staff member in the options
  const staffOptions = driverToEdit 
    ? [...combinedStaffUsers, selectedStaff ? {
        id: `staff_${selectedStaff.id}`,
        name: selectedStaff.name,
        type: 'staff' as const,
        original_id: selectedStaff.id.toString(),
        email: selectedStaff.email || '',
        position: selectedStaff.position
      } : null].filter(Boolean) as CombinedStaffUser[]
    : combinedStaffUsers;

  const handleFieldChange = (fieldName: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => {
      const updatedFormData = { ...prev, [fieldName]: value };

      if (fieldName === 'staff_id' && !isNewDriver) {
        const selectedPerson = combinedStaffUsers.find(p => p.original_id === value);
        if (selectedPerson?.type === 'worker') {
          // Find worker data to get driving licence number
          const worker = combinedStaffUsers.find(w => w.id === selectedPerson.id);
          if (worker) {
            updatedFormData.licence_number = ''; // Workers might have licence numbers
          }
        } else {
          updatedFormData.licence_number = '';
        }
      }
      return updatedFormData;
    });
  };

  const handleNext = () => {
    setError(null);
    if (isNewDriver) {
      if (!formData.full_name.trim()) {
        setError("Please enter the driver's full name");
        return;
      }
    } else {
      if (!formData.staff_id) {
        setError('Please select a staff member');
        return;
      }
    }
    setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (step !== 2) return;

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!formData.licence_number) throw new Error('Please enter a licence number');
      if (!formData.licence_expiry) throw new Error('Please enter a licence expiry date');

      const dataToSave: any = {
        licence_number: formData.licence_number,
        licence_expiry: formData.licence_expiry,
        last_check: formData.last_check || null,
        points: formData.points || 0,
      };

      if (isNewDriver) {
        if (!formData.full_name.trim()) throw new Error("Please enter the driver's full name");
        dataToSave.full_name = formData.full_name.trim();
        dataToSave.staff_id = null;
      } else {
        if (!formData.staff_id) throw new Error('Please select a staff member');
        const selectedPerson = combinedStaffUsers.find(p => p.original_id === formData.staff_id);
        if (!selectedPerson) throw new Error('Selected person not found');

        if (selectedPerson.type === 'staff') {
          dataToSave.staff_id = parseInt(selectedPerson.original_id, 10);
          dataToSave.full_name = null;
        } else { // User or Worker
          dataToSave.staff_id = null;
          dataToSave.full_name = selectedPerson.name;
        }
      }

      let error;
      if (driverToEdit) {
        ({ error } = await supabase
          .from('drivers')
          .update(dataToSave)
          .eq('id', driverToEdit.id));
      } else {
        dataToSave.user_id = user.id;
        ({ error } = await supabase
          .from('drivers')
          .insert([dataToSave]));
      }

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving driver:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Driver Information', 'Licence Details'];

  // Create staff options for select
  const staffSelectOptions = staffOptions.map(staff => ({
    value: staff.original_id,
    label: `${staff.name} - ${
      staff.type === 'staff' ? staff.position || 'Staff' :
      staff.type === 'worker' ? staff.company || 'Worker' :
      'User'
    } (${staff.type})`
  }));

  // Driver type radio options
  const driverTypeOptions = [
    {
      value: 'existing',
      label: 'Select existing staff member',
      description: 'Choose from registered staff, users, or workers'
    },
    {
      value: 'new',
      label: driverToEdit ? 'Driver by name' : 'Add new driver',
      description: 'Enter driver information manually'
    }
  ];

  return (
    <FormContainer isOpen={true} maxWidth="md">
      <FormHeader
        title={driverToEdit ? 'Edit Driver Licence Information' : 'Add Driver Licence Information'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={step}
          totalSteps={2}
          stepLabels={stepLabels}
        />
        
        {step === 1 && (
          <div className="space-y-6">
            <FormField label="Driver Information">
              <ModernRadioGroup
                name="driverType"
                options={driverTypeOptions}
                selectedValue={isNewDriver ? 'new' : 'existing'}
                onChange={(value) => setIsNewDriver(value === 'new')}
                layout="vertical"
              />
            </FormField>

            {!isNewDriver ? (
              <FormField 
                label="Staff Member" 
                required 
                error={error && !formData.staff_id ? 'Please select a staff member' : undefined}
              >
                <Select
                  id="staff_id"
                  value={String(formData.staff_id)}
                  onChange={handleFieldChange('staff_id')}
                  options={staffSelectOptions}
                  placeholder="Select a staff member"
                />
              </FormField>
            ) : (
              <FormField 
                label="Driver Full Name" 
                required 
                error={error && !formData.full_name ? "Please enter the driver's full name" : undefined}
              >
                <TextInput
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleFieldChange('full_name')}
                  placeholder="Enter driver's full name"
                />
              </FormField>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <FormField 
              label="Licence Number" 
              required 
              error={error && !formData.licence_number ? 'Please enter a licence number' : undefined}
            >
              <TextInput
                id="licence_number"
                value={formData.licence_number}
                onChange={handleFieldChange('licence_number')}
                placeholder="Enter licence number"
              />
            </FormField>

            <FormField 
              label="Licence Expiry Date" 
              required 
              error={error && !formData.licence_expiry ? 'Please enter a licence expiry date' : undefined}
            >
              <DateInput
                id="licence_expiry"
                value={formData.licence_expiry}
                onChange={handleFieldChange('licence_expiry')}
              />
            </FormField>

            <FormField label="Last Check Date">
              <DateInput
                id="last_check"
                value={formData.last_check}
                onChange={handleFieldChange('last_check')}
              />
            </FormField>

            <FormField label="Points">
              <NumberInput
                id="points"
                value={formData.points}
                onChange={handleFieldChange('points')}
                min={0}
              />
            </FormField>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md mt-6">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onPrevious={step > 1 ? handlePrevious : undefined}
        onNext={step < 2 ? handleNext : undefined}
        onSubmit={step === 2 ? handleSubmit : undefined}
        isFirstStep={step === 1}
        isLastStep={step === 2}
        submitButtonText={loading ? 'Saving...' : (driverToEdit ? 'Update Licence Info' : 'Save')}
        loading={loading}
      />
    </FormContainer>
  );
}
