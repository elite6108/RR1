import React from 'react';
import { FormField } from '../../../../../utils/form';

interface VehicleFormStepThreeProps {
  formData: {
    has_congestion: boolean;
    has_dartford: boolean;
    has_clean_air: boolean;
    ulez: string;
    notes: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const VehicleFormStepThree = ({
  formData,
  setFormData,
  handleChange
}: VehicleFormStepThreeProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Additional Services
          </label>
          
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFormData(prev => ({ ...prev, has_congestion: !prev.has_congestion }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFormData(prev => ({ ...prev, has_congestion: !prev.has_congestion }));
              }
            }}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              formData.has_congestion
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <span className="text-sm font-medium">Added to Congestion Charge</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
              formData.has_congestion
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {formData.has_congestion ? '✓' : ''}
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setFormData(prev => ({ ...prev, has_dartford: !prev.has_dartford }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFormData(prev => ({ ...prev, has_dartford: !prev.has_dartford }));
              }
            }}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              formData.has_dartford
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <span className="text-sm font-medium">Added to Dartford Crossing</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
              formData.has_dartford
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {formData.has_dartford ? '✓' : ''}
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setFormData(prev => ({ ...prev, has_clean_air: !prev.has_clean_air }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFormData(prev => ({ ...prev, has_clean_air: !prev.has_clean_air }));
              }
            }}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              formData.has_clean_air
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <span className="text-sm font-medium">Added to Clean Air Zone</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
              formData.has_clean_air
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {formData.has_clean_air ? '✓' : ''}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 px-4">
            This is for Bath, Birmingham, Bradford, Bristol, Portsmouth, Sheffield, Tyneside
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            ULEZ
          </label>
          
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFormData(prev => ({ ...prev, ulez: prev.ulez === 'should_be_paid' ? '' : 'should_be_paid' }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFormData(prev => ({ ...prev, ulez: prev.ulez === 'should_be_paid' ? '' : 'should_be_paid' }));
              }
            }}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              formData.ulez === 'should_be_paid'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <span className="text-sm font-medium">Should be paid</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
              formData.ulez === 'should_be_paid'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {formData.ulez === 'should_be_paid' ? '✓' : ''}
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => setFormData(prev => ({ ...prev, ulez: prev.ulez === 'meets_standard' ? '' : 'meets_standard' }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFormData(prev => ({ ...prev, ulez: prev.ulez === 'meets_standard' ? '' : 'meets_standard' }));
              }
            }}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              formData.ulez === 'meets_standard'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <span className="text-sm font-medium">Meets the standard</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200 ${
              formData.ulez === 'meets_standard'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}>
              {formData.ulez === 'meets_standard' ? '✓' : ''}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-4 px-4">
            If vehicles are added to the Transport for London (TfL) list and are subject to the ULEZ charge, the Fleet Auto Pay system will automatically cover the payment.
          </p>
        </div>
      </div>

      <FormField label="Notes">
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-vertical"
        />
      </FormField>
    </div>
  );
};
