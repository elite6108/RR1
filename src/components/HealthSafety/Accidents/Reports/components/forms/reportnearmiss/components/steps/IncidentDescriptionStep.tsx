import React from 'react';
import { FormData } from '../../types/FormData';
import { Calendar } from '../../../../../../../../../utils/calendar/Calendar';

interface IncidentDescriptionStepProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
}

export default function IncidentDescriptionStep({
  formData,
  setFormData
}: IncidentDescriptionStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Where did the incident occur? *</label>
        <input 
          type="text" 
          value={formData.incidentLocation} 
          onChange={e => setFormData(prev => ({ ...prev, incidentLocation: e.target.value }))} 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Injury / Incident Date *</label>
        <Calendar
          selectedDate={formData.incidentDate}
          onDateSelect={(date: string) => setFormData(prev => ({ ...prev, incidentDate: date }))}
          placeholder="Select incident date"
          className=""
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Describe what happened and how *</label>
        <textarea 
          value={formData.incidentDescription} 
          onChange={e => setFormData(prev => ({ ...prev, incidentDescription: e.target.value }))} 
          rows={4} 
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
          required 
        />
        <p className="text-xs text-gray-500 mt-1">
          In the case of an injury, state what the injured person was doing at the time and side of the body (left or right). 
          (Where possible, take photographs of the general area but not of the injured persons.) 
          In the case of an environmental incident, state the events that caused the incident (details of plant involved, photographs, wherever practicable, must be taken). 
          In the case of damage, indicate if the damage is to permanent works, temporary works, plant, temporary buildings/contents, and employee's permanent effects.
        </p>
      </div>
    </div>
  );
}
