import React from 'react';
import { SevenDayIncapacitationFormData } from '../types/SevenDayIncapacitationTypes';

interface SevenDayInjuryStepsProps {
  formData: SevenDayIncapacitationFormData;
  setFormData: React.Dispatch<React.SetStateAction<SevenDayIncapacitationFormData>>;
}

export const SevenDayInjuryLocationStep: React.FC<SevenDayInjuryStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select location(s) of injury *</label>
    <div className="flex flex-wrap gap-2">
      {[
        'Abdomen', 'Ankle', 'Arm/Shoulder', 'Back', 'Chest', 'Digestive System',
        'Eye', 'Face/neck', 'Finger', 'Foot', 'Hand', 'Head', 'Leg/Hip',
        'Respiratory system', 'Wrist', 'Other'
      ].map(option => (
        <button
          type="button"
          key={option}
          onClick={() => setFormData(fd => ({
            ...fd,
            injuryLocations: fd.injuryLocations.includes(option)
              ? fd.injuryLocations.filter(o => o !== option)
              : [...fd.injuryLocations, option]
          }))}
          className={`px-3 py-1 rounded-full border ${
            formData.injuryLocations.includes(option)
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export const SevenDayInjuryTypeStep: React.FC<SevenDayInjuryStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select type(s) of injury *</label>
    <div className="flex flex-wrap gap-2">
      {[
        'Amputation', 'Asphyxiation/gassing', 'Bruising/swelling', 'Burn/scald',
        'Crushing', 'Cut/laceration/abrasion', 'Dislocation', 'Electric shock',
        'Foreign body', 'Fracture', 'Ill heath', 'Ingestion', 'Internal',
        'Loss of consciousness', 'Multiple', 'Puncture', 'Shock/concussion',
        'Strain/sprain', 'Whiplash', 'Other'
      ].map(option => (
        <button
          type="button"
          key={option}
          onClick={() => setFormData(fd => ({
            ...fd,
            injuryTypes: fd.injuryTypes.includes(option)
              ? fd.injuryTypes.filter(o => o !== option)
              : [...fd.injuryTypes, option]
          }))}
          className={`px-3 py-1 rounded-full border ${
            formData.injuryTypes.includes(option)
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export const SevenDayFirstAidStep: React.FC<SevenDayInjuryStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Was the injured person advised to see their doctor or visit hospital? *</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, advisedMedical: true })}
          className={`flex-1 px-4 py-2 rounded-md border ${
            formData.advisedMedical
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, advisedMedical: false })}
          className={`flex-1 px-4 py-2 rounded-md border ${
            !formData.advisedMedical
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          No
        </button>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Was drug or alcohol testing required? *</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, drugAlcoholTest: true })}
          className={`flex-1 px-4 py-2 rounded-md border ${
            formData.drugAlcoholTest
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, drugAlcoholTest: false })}
          className={`flex-1 px-4 py-2 rounded-md border ${
            !formData.drugAlcoholTest
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          No
        </button>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Include details of any first aid administered *</label>
      <textarea 
        value={formData.firstAidDetails} 
        onChange={e => setFormData({ ...formData, firstAidDetails: e.target.value })} 
        rows={4} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
  </div>
);

export const SevenDayHealthSafetyStep: React.FC<SevenDayInjuryStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Basic cause *</label>
      <select 
        value={formData.basicCause} 
        onChange={e => setFormData({ ...formData, basicCause: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required
      >
        <option value="">Select basic cause</option>
        <option value="Asphyxiation">Asphyxiation</option>
        <option value="Collision">Collision</option>
        <option value="Contact with electricity">Contact with electricity</option>
        <option value="Contact with flying particles">Contact with flying particles</option>
        <option value="Contact with tool/equipment/machinery">Contact with tool/equipment/machinery</option>
        <option value="Contact with/exposed to air/water pressure">Contact with/exposed to air/water pressure</option>
        <option value="Contact with/exposed to hazardous substance">Contact with/exposed to hazardous substance</option>
        <option value="Contact with/exposed to heat/acid">Contact with/exposed to heat/acid</option>
        <option value="Drowning">Drowning</option>
        <option value="Explosion">Explosion</option>
        <option value="Exposure to noise/vibration">Exposure to noise/vibration</option>
        <option value="Fall down stairs/steps">Fall down stairs/steps</option>
        <option value="Fall from height">Fall from height</option>
        <option value="Fall on the same level">Fall on the same level</option>
        <option value="Fire">Fire</option>
        <option value="Loss of containment/unintentional release">Loss of containment/unintentional release</option>
        <option value="Manual Handling">Manual Handling</option>
        <option value="Repetitive motion/action">Repetitive motion/action</option>
        <option value="Step on/struck against stationary object">Step on/struck against stationary object</option>
        <option value="Struck by falling object">Struck by falling object</option>
        <option value="Struck by moving object">Struck by moving object</option>
        <option value="Struck or trapped by something collapsing/overturning">Struck or trapped by something collapsing/overturning</option>
        <option value="Trapped between objects">Trapped between objects</option>
        <option value="Other">Other</option>
      </select>
    </div>
  </div>
);
