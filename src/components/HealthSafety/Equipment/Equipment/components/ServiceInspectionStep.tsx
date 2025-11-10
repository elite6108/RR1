import React from 'react';
import { INTERVAL_UNITS, INSPECTION_FREQUENCIES } from '../utils/constants';
import type { EquipmentFormData } from '../types';

interface ServiceInspectionStepProps {
  formData: EquipmentFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function ServiceInspectionStep({ formData, onChange }: ServiceInspectionStepProps) {
  return (
    <div className="space-y-6">
      {/* Inspection Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="inspection_interval" className="block text-sm font-medium text-gray-700 mb-2">
            Inspection Interval <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="number"
            id="inspection_interval"
            name="inspection_interval"
            min="1"
            value={formData.inspection_interval}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="inspection_frequency" className="block text-sm font-medium text-gray-700 mb-2">
            Frequency <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            id="inspection_frequency"
            name="inspection_frequency"
            value={formData.inspection_frequency}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {INSPECTION_FREQUENCIES.map(freq => (
              <option key={freq} value={freq}>{freq}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="inspection_notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            id="inspection_notes"
            name="inspection_notes"
            value={formData.inspection_notes}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Service Interval Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="service_interval_value" className="block text-sm font-medium text-gray-700 mb-2">
            Service Interval <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="number"
            id="service_interval_value"
            name="service_interval_value"
            min="1"
            value={formData.service_interval_value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="service_interval_unit" className="block text-sm font-medium text-gray-700 mb-2">
            Unit <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            id="service_interval_unit"
            name="service_interval_unit"
            value={formData.service_interval_unit}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {INTERVAL_UNITS.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="service_notes" className="block text-sm font-medium text-gray-700 mb-2">
            Service Notes <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            id="service_notes"
            name="service_notes"
            value={formData.service_notes}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}
