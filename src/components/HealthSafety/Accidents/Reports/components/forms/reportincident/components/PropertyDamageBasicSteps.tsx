import React from 'react';
import { PropertyDamageFormData } from '../types/PropertyDamageTypes';
import { Calendar } from '../../../../../../../../utils/calendar/Calendar';

interface PropertyDamageBasicStepsProps {
  formData: PropertyDamageFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyDamageFormData>>;
  isLoadingId: boolean;
}

export const PropertyDamageDetailsStep: React.FC<PropertyDamageBasicStepsProps> = ({ formData, isLoadingId }) => (
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

export const PropertyDamageDescriptionStep: React.FC<PropertyDamageBasicStepsProps> = ({ formData, setFormData }) => (
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

export const PropertyDamageDamageStep: React.FC<PropertyDamageBasicStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">List affected items/works involved (including serial numbers/plant numbers and value if known, if applicable) *</label>
      <textarea 
        value={formData.affectedItems} 
        onChange={e => setFormData({ ...formData, affectedItems: e.target.value })} 
        rows={3} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Crime Number / Police log reference *</label>
      <input 
        type="text" 
        value={formData.crimeReference} 
        onChange={e => setFormData({ ...formData, crimeReference: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date and time of reporting *</label>
      <input 
        type="datetime-local" 
        value={formData.reportingDatetime} 
        onChange={e => setFormData({ ...formData, reportingDatetime: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name of person who reported the incident *</label>
      <input 
        type="text" 
        value={formData.reporterName} 
        onChange={e => setFormData({ ...formData, reporterName: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
  </div>
);

export const PropertyDamageRootCausesStep: React.FC<PropertyDamageBasicStepsProps> = ({ formData, setFormData }) => (
  <div className="space-y-6">
    {/* Work Environment */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Environment *</label>
      <div className="flex flex-wrap gap-2">
        {['Access/Egress','Defective workplace','Design/Layout','Housekeeping','Lack of room','Lighting','Noise/distraction','Weather','Other'].map(option => (
          <button 
            type="button" 
            key={option} 
            onClick={() => setFormData(fd => ({ 
              ...fd, 
              rootCauseWorkEnvironment: fd.rootCauseWorkEnvironment.includes(option) 
                ? fd.rootCauseWorkEnvironment.filter(o => o !== option) 
                : [...fd.rootCauseWorkEnvironment, option] 
            }))} 
            className={`px-3 py-1 rounded-full border ${formData.rootCauseWorkEnvironment.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    
    {/* Human Factors */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Human Factors *</label>
      <div className="flex flex-wrap gap-2">
        {['Error of judgement','Failure to adhere to the RAs','Failure to follow rules','Fatigue','Horseplay','Instructions misunderstood','Lack of experience','Lapse in concentration','Undue haste','Unsafe attitude','Working without authorisation','Other'].map(option => (
          <button 
            type="button" 
            key={option} 
            onClick={() => setFormData(fd => ({ 
              ...fd, 
              rootCauseHumanFactors: fd.rootCauseHumanFactors.includes(option) 
                ? fd.rootCauseHumanFactors.filter(o => o !== option) 
                : [...fd.rootCauseHumanFactors, option] 
            }))} 
            className={`px-3 py-1 rounded-full border ${formData.rootCauseHumanFactors.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    
    {/* PPE */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PPE *</label>
      <div className="flex flex-wrap gap-2">
        {['Design','Maintenance/defective','Not provided/unavailable','Not used','Work type','Other'].map(option => (
          <button 
            type="button" 
            key={option} 
            onClick={() => setFormData(fd => ({ 
              ...fd, 
              rootCausePpe: fd.rootCausePpe.includes(option) 
                ? fd.rootCausePpe.filter(o => o !== option) 
                : [...fd.rootCausePpe, option] 
            }))} 
            className={`px-3 py-1 rounded-full border ${formData.rootCausePpe.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    
    {/* Management */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Management *</label>
      <div className="flex flex-wrap gap-2">
        {['RAMS not communicated','Supervision','System Failure','Training','Other'].map(option => (
          <button 
            type="button" 
            key={option} 
            onClick={() => setFormData(fd => ({ 
              ...fd, 
              rootCauseManagement: fd.rootCauseManagement.includes(option) 
                ? fd.rootCauseManagement.filter(o => o !== option) 
                : [...fd.rootCauseManagement, option] 
            }))} 
            className={`px-3 py-1 rounded-full border ${formData.rootCauseManagement.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    
    {/* Plant / Equipment */}
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plant / Equipment *</label>
      <div className="flex flex-wrap gap-2">
        {['Construction/design','Installation','Maintenance','Mechanical failure','Operation/use','Safety device','Other'].map(option => (
          <button 
            type="button" 
            key={option} 
            onClick={() => setFormData(fd => ({ 
              ...fd, 
              rootCausePlantEquipment: fd.rootCausePlantEquipment.includes(option) 
                ? fd.rootCausePlantEquipment.filter(o => o !== option) 
                : [...fd.rootCausePlantEquipment, option] 
            }))} 
            className={`px-3 py-1 rounded-full border ${formData.rootCausePlantEquipment.includes(option) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  </div>
);
