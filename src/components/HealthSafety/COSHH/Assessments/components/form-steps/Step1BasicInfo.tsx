import React from 'react';
import { CoshhAssessment } from '../../types';
import { Calendar } from '../../../../../../utils/calendar/Calendar';

interface Step1BasicInfoProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  setFormData
}) => {
  const toggleArrayValue = (array: string[], value: string): string[] => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    } else {
      return [...array, value];
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        COSHH Assessment Sheet - Basic Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name of Substance *
          </label>
          <input
            type="text"
            value={formData.substance_name}
            onChange={(e) => setFormData({...formData, substance_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            COSHH Reference *
          </label>
          <input
            type="text"
            value={formData.coshh_reference}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white bg-gray-50 dark:bg-gray-600"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-generated sequential reference number</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Supplied by *
          </label>
          <input
            type="text"
            value={formData.supplied_by}
            onChange={(e) => setFormData({...formData, supplied_by: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date of Assessment *
          </label>
          <Calendar
            selectedDate={formData.assessment_date}
            onDateSelect={(date) => setFormData({...formData, assessment_date: date})}
            isDisabled={(date) => {
              const today = new Date();
              const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              return dateOnly.getTime() !== todayOnly.getTime();
            }}
            placeholder="Select assessment date"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description of Substance *
          </label>
          <textarea
            value={formData.description_of_substance}
            onChange={(e) => setFormData({...formData, description_of_substance: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Form <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <select
            value={formData.form}
            onChange={(e) => setFormData({...formData, form: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Form</option>
            <option value="Liquid">Liquid</option>
            <option value="Gas">Gas</option>
            <option value="Paste">Paste</option>
            <option value="Solid">Solid</option>
            <option value="Powder">Powder</option>
            <option value="Granules">Granules</option>
            <option value="Aerosol">Aerosol</option>
            <option value="Foam">Foam</option>
            <option value="Gel">Gel</option>
            <option value="Cream">Cream</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Odour <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.odour}
            onChange={(e) => setFormData({...formData, odour: e.target.value})}
            placeholder="Describe the odour"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Method of Use *
          </label>
          <textarea
            value={formData.method_of_use}
            onChange={(e) => setFormData({...formData, method_of_use: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Site and Location *
          </label>
          <textarea
            value={formData.site_and_location}
            onChange={(e) => setFormData({...formData, site_and_location: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Review Date <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <Calendar
            selectedDate={formData.review_date}
            onDateSelect={(date) => setFormData({...formData, review_date: date})}
            isDisabled={(date) => {
              const today = new Date();
              const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
              return dateOnly.getTime() !== todayOnly.getTime();
            }}
            placeholder="Select review date"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Persons at Risk <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['Staff', 'Public', 'Young/Pregnant workers', 'Visitors', 'Contractors'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFormData({
                ...formData, 
                persons_at_risk: toggleArrayValue(formData.persons_at_risk, option)
              })}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                formData.persons_at_risk.includes(option)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 1 of 13:</strong> Please fill in the basic information about the substance being assessed. 
          Required fields are marked with an asterisk (*).
        </p>
      </div>
    </div>
  );
};