import React from 'react';
import { FormField, TextInput, Select, NumberInput } from '../../../../../utils/form';

interface Driver {
  id: string;
  staff_id: number;
  licence_number: string;
  licence_expiry: string;
  user_id: string;
  full_name?: string;
  last_check?: string;
  points?: number;
  staff?: {
    name: string;
  } | null;
}

interface ChecklistFormStepOneProps {
  createdByName: string;
  setCreatedByName: (name: string) => void;
  driverName: string;
  setDriverName: (name: string) => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  frequency: 'daily' | 'weekly' | 'monthly';
  setFrequency: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  drivers: Driver[];
  loadingDrivers: boolean;
}

export const ChecklistFormStepOne = ({
  createdByName,
  setCreatedByName,
  driverName,
  setDriverName,
  mileage,
  setMileage,
  frequency,
  setFrequency,
  drivers,
  loadingDrivers
}: ChecklistFormStepOneProps) => {
  const driverOptions = [
    { value: '', label: loadingDrivers ? 'Loading...' : 'Select a driver', disabled: true },
    ...drivers.map(driver => ({
      value: driver.staff?.name || driver.full_name || 'Unknown Driver',
      label: driver.staff?.name || driver.full_name || 'Unknown Driver'
    }))
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Your Name" required>
          <TextInput
            id="createdByName"
            value={createdByName}
            onChange={(e) => setCreatedByName(e.target.value)}
            placeholder="Enter your full name"
          />
        </FormField>
        
        <FormField label="Driver's Name" required>
          <Select
            id="driverName"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            options={driverOptions}
            disabled={loadingDrivers}
          />
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Mileage" required>
          <NumberInput
            id="mileage"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Enter current mileage"
          />
        </FormField>
        
        <FormField label="Frequency" required>
          <Select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
            options={frequencyOptions}
          />
        </FormField>
      </div>
    </div>
  );
};
