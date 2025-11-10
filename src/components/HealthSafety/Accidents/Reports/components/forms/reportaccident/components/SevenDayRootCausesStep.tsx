import React from 'react';
import { SevenDayIncapacitationFormData } from '../types/SevenDayIncapacitationTypes';

interface SevenDayRootCausesStepProps {
  formData: SevenDayIncapacitationFormData;
  setFormData: React.Dispatch<React.SetStateAction<SevenDayIncapacitationFormData>>;
}

export const SevenDayRootCausesStep: React.FC<SevenDayRootCausesStepProps> = ({ formData, setFormData }) => (
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
            className={`px-3 py-1 rounded-full border ${
              formData.rootCauseWorkEnvironment.includes(option) 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
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
            className={`px-3 py-1 rounded-full border ${
              formData.rootCauseHumanFactors.includes(option) 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
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
            className={`px-3 py-1 rounded-full border ${
              formData.rootCausePpe.includes(option) 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
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
            className={`px-3 py-1 rounded-full border ${
              formData.rootCauseManagement.includes(option) 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
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
            className={`px-3 py-1 rounded-full border ${
              formData.rootCausePlantEquipment.includes(option) 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  </div>
);
