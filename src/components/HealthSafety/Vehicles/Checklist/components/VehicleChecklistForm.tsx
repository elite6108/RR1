import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { AlertTriangle } from 'lucide-react';
import { NumberPlate } from '../../shared/components/NumberPlate';
import { ChecklistFormStepOne } from './ChecklistFormStepOne';
import { ChecklistFormSteps } from './ChecklistFormSteps';
import { handleImageUpload, handleRemoveImage, generateSignedUrls } from '../utils/imageUpload';
import type { VehicleChecklistFormProps, ChecklistItem } from '../../shared/types';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter, 
  StepIndicator 
} from '../../../../../utils/form';

interface DriverWithStaff {
  id: string;
  staff_id: number;
  licence_number: string;
  licence_expiry: string;
  user_id: string;
  staff: {
    name: string;
  };
}

export default function VehicleChecklistForm({
  vehicle,
  checklistToEdit,
  onClose,
  onSuccess,
}: VehicleChecklistFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [notes, setNotes] = useState('');
  const [createdByName, setCreatedByName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [drivers, setDrivers] = useState<DriverWithStaff[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [mileage, setMileage] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    if (checklistToEdit) {
      // When editing, we need to generate signed URLs for all images
      const loadChecklistWithSignedUrls = async () => {
        const itemsWithSignedUrls = await generateSignedUrls(checklistToEdit.items);
        
        setItems(itemsWithSignedUrls);
        setNotes(checklistToEdit.notes || '');
        setCreatedByName(checklistToEdit.created_by_name);
        setDriverName(checklistToEdit.driver_name);
        setMileage(checklistToEdit.mileage);
        setFrequency(checklistToEdit.frequency);
      };
      
      loadChecklistWithSignedUrls();
    }
    fetchUserFullName();
    fetchDrivers();
  }, [checklistToEdit]);

  const fetchUserFullName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) {
        setCreatedByName(user.user_metadata.display_name);
      }
    } catch (err) {
      console.error('Error fetching user display name:', err);
    }
  };

  const fetchDrivers = async () => {
    try {
      setLoadingDrivers(true);
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          staff (
            name
          )
        `)
        .order('staff(name)', { ascending: true });

      if (error) throw error;
      setDrivers(data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching drivers');
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleAddItem = (category: 'inside' | 'outside') => {
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      name: '',
      status: 'pass',
      notes: '',
      image_url: '',
      temp_category: category,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof ChecklistItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // For name field, check if already selected
          if (field === 'name' && value) {
            const isItemAlreadySelected = prev.some(
              (otherItem) => otherItem.id !== id && otherItem.name === value
            );

            if (isItemAlreadySelected) {
              setError('This item has already been selected');
              return item;
            }
            setError(null);
          }

          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleImageUploadWrapper = async (itemId: string, file: File) => {
    await handleImageUpload(itemId, file, vehicle.id, setUploadingImage, setError, setItems);
  };

  const handleRemoveImageWrapper = (itemId: string) => {
    handleRemoveImage(itemId, setItems);
  };
  
  const validateStep = (step: number): boolean => {
    setError(null);
    switch(step) {
      case 1:
        if (!createdByName.trim() || !driverName.trim() || !mileage.trim()) {
          setError("Please fill out all required fields for this step.");
          return false;
        }
        break;
      case 2:
      case 3:
        if (items.length === 0 || items.some(item => !item.name.trim())) {
          setError("Please add and name at least one checklist item.");
          return false;
        }
        break;
      // Step 4 is optional
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit(new Event('submit') as any);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const status = items.some((item) => item.status === 'fail') ? 'fail' : 'pass';
      
      const processedItems = items.map(item => {
        const { signed_url, temp_category, ...rest } = item;
        return rest;
      });

      let error;
      if (checklistToEdit) {
        ({ error } = await supabase
          .from('vehicle_checklists')
          .update({
            items: processedItems,
            notes: notes || null,
            created_by_name: createdByName,
            driver_name: driverName,
            mileage: mileage,
            frequency: frequency,
            status,
          })
          .eq('id', checklistToEdit.id));
      } else {
        ({ error } = await supabase.from('vehicle_checklists').insert([
          {
            vehicle_id: vehicle.id,
            user_id: user.id,
            items: processedItems,
            notes: notes || null,
            created_by_name: createdByName,
            driver_name: driverName,
            mileage: mileage,
            frequency: frequency,
            status,
          },
        ]));
      }

      if (error) throw error;
      onSuccess();
    } catch (err) {
      console.error('Error saving vehicle checklist:', err);
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Details', 'Outside Checklist', 'Inside Checklist', 'Notes & Summary'];

  const getFormTitle = () => {
    const title = checklistToEdit ? 'Edit Checklist' : 'New Vehicle Checklist';
    return title;
  };

  const handleFormSubmit = () => {
    handleSubmit(new Event('submit') as any);
  };

  return (
    <FormContainer isOpen={true} maxWidth="2xl">
      <FormHeader 
        title={getFormTitle()} 
        onClose={onClose}
        subtitle={
          <div className="space-y-1">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Title:</span> {getFormTitle()}
            </div>
            <div className="flex items-center">
              <NumberPlate registration={vehicle.registration} className="mr-2" />
              <span className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</span>
            </div>
          </div>
        }
      />

      <FormContent>
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={4} 
          stepLabels={stepLabels} 
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <ChecklistFormStepOne
              createdByName={createdByName}
              setCreatedByName={setCreatedByName}
              driverName={driverName}
              setDriverName={setDriverName}
              mileage={mileage}
              setMileage={setMileage}
              frequency={frequency}
              setFrequency={setFrequency}
              drivers={drivers}
              loadingDrivers={loadingDrivers}
            />
          )}

          {currentStep > 1 && (
            <ChecklistFormSteps
              currentStep={currentStep}
              items={items}
              notes={notes}
              setNotes={setNotes}
              uploadingImage={uploadingImage}
              onItemChange={handleItemChange}
              onImageUpload={handleImageUploadWrapper}
              onRemoveImage={handleRemoveImageWrapper}
              onRemoveItem={handleRemoveItem}
              onAddItem={handleAddItem}
            />
          )}
        </form>

        {error && (
          <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-md">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}
      </FormContent>

      <FormFooter
        onCancel={onClose}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleFormSubmit}
        showPrevious={true}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 4}
        nextButtonText="Next"
        submitButtonText={checklistToEdit ? 'Save Changes' : 'Submit Checklist'}
        cancelButtonText="Cancel"
        previousButtonText="Previous"
        disabled={false}
        loading={loading}
      />
    </FormContainer>
  );
}
