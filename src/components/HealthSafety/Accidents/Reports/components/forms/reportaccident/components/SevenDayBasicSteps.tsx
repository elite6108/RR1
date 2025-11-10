import React from 'react';
import { SevenDayIncapacitationFormData } from '../types/SevenDayIncapacitationTypes';
import { Calendar } from '../../../../../../../../utils/calendar/Calendar';

interface SevenDayBasicStepsProps {
  formData: SevenDayIncapacitationFormData;
  setFormData: React.Dispatch<React.SetStateAction<SevenDayIncapacitationFormData>>;
  isLoadingId: boolean;
}

export const SevenDayDetailsStep: React.FC<SevenDayBasicStepsProps> = ({ formData, isLoadingId }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID</label>
      <input 
        type="text" 
        value={isLoadingId ? "Loading..." : formData.autoId} 
        readOnly 
        disabled 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Report Type</label>
      <input 
        type="text" 
        value={formData.reportType} 
        readOnly 
        disabled 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
      <input 
        type="text" 
        value={formData.category} 
        readOnly 
        disabled 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
      />
    </div>
  </div>
);

export const SevenDayDescriptionStep: React.FC<SevenDayBasicStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Where did the incident occur? *</label>
      <input 
        type="text" 
        value={formData.incidentLocation} 
        onChange={e => setFormData({ ...formData, incidentLocation: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Incident Date *</label>
      <Calendar
        selectedDate={formData.incidentDate}
        onDateSelect={(date: string) => setFormData({ ...formData, incidentDate: date })}
        placeholder="Select incident date"
        className=""
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Describe what happened and how *</label>
      <textarea 
        value={formData.incidentDescription} 
        onChange={e => setFormData({ ...formData, incidentDescription: e.target.value })} 
        rows={4} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
  </div>
);

export const SevenDayInjuredPersonStep: React.FC<SevenDayBasicStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
      <input 
        type="text" 
        value={formData.injuredPersonName} 
        onChange={e => setFormData({ ...formData, injuredPersonName: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Address *</label>
      <input 
        type="text" 
        value={formData.injuredPersonAddress} 
        onChange={e => setFormData({ ...formData, injuredPersonAddress: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
      <input 
        type="tel" 
        value={formData.injuredPersonPhone} 
        onChange={e => setFormData({ ...formData, injuredPersonPhone: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position *</label>
      <input 
        type="text" 
        value={formData.injuredPersonPosition} 
        onChange={e => setFormData({ ...formData, injuredPersonPosition: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Was any time lost? *</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, timeLost: true })}
          className={`flex-1 px-4 py-2 rounded-md border ${
            formData.timeLost
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, timeLost: false })}
          className={`flex-1 px-4 py-2 rounded-md border ${
            !formData.timeLost
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          No
        </button>
      </div>
    </div>
    {formData.timeLost && (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date <span className="text-gray-400 text-xs">(optional)</span></label>
          <Calendar
            selectedDate={formData.timeLostStartDate}
            onDateSelect={(date: string) => setFormData({ ...formData, timeLostStartDate: date })}
            placeholder="Select start date"
            className=""
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date <span className="text-gray-400 text-xs">(optional)</span></label>
          <Calendar
            selectedDate={formData.timeLostEndDate}
            onDateSelect={(date: string) => setFormData({ ...formData, timeLostEndDate: date })}
            placeholder="Select end date"
            className=""
          />
        </div>
      </div>
    )}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name of A&E visited *</label>
      <input 
        type="text" 
        value={formData.aeHospitalName} 
        onChange={e => setFormData({ ...formData, aeHospitalName: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detail all PPE required for the activity *</label>
      <textarea 
        value={formData.requiredPpe} 
        onChange={e => setFormData({ ...formData, requiredPpe: e.target.value })} 
        rows={3} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detail all PPE worn at the time of incident *</label>
      <textarea 
        value={formData.wornPpe} 
        onChange={e => setFormData({ ...formData, wornPpe: e.target.value })} 
        rows={3} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
  </div>
);
