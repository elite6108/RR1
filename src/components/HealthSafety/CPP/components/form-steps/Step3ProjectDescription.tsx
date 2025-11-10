import React from 'react';
import type { CPPFormData } from '../../../../../types/cpp';
import { Calendar } from '../../../../../utils/calendar/Calendar';

interface Step3ProjectDescriptionProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const WORK_TYPES = [
  'Groundworks',
  'Padel Court Construction',
  'Padel Court Installation',
  'Single Dwelling',
  'Multi Dwelling',
  'Renovation',
  'Other'
] as const;

export function Step3ProjectDescription({ data, onChange }: Step3ProjectDescriptionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      projectDescription: {
        ...data.projectDescription,
        [name]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Project Description</h3>
      
      <div>
        <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-2">
          Type of Work
        </label>
        <select
          id="workType"
          name="workType"
          value={data.projectDescription.workType || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select type of work</option>
          {WORK_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Project Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={data.projectDescription.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposed Start Date
          </label>
          <Calendar
            selectedDate={data.projectDescription.startDate}
            onDateSelect={(date) => onChange({
              projectDescription: {
                ...data.projectDescription,
                startDate: date
              }
            })}
            placeholder="Select start date"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposed End Date
          </label>
          <Calendar
            selectedDate={data.projectDescription.endDate}
            onDateSelect={(date) => onChange({
              projectDescription: {
                ...data.projectDescription,
                endDate: date
              }
            })}
            isDisabled={(date) => {
              if (!data.projectDescription.startDate) return false;
              const startDate = new Date(data.projectDescription.startDate);
              return date < startDate;
            }}
            placeholder="Select end date"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="orderReference" className="block text-sm font-medium text-gray-700 mb-2">
          Order Reference
        </label>
        <input
          type="text"
          id="orderReference"
          name="orderReference"
          value={data.projectDescription.orderReference || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}