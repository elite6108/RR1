import React from 'react';
import { UtilityDamageFormData } from '../types/UtilityDamageTypes';

interface UtilityDamageDamageStepProps {
  formData: UtilityDamageFormData;
  setFormData: React.Dispatch<React.SetStateAction<UtilityDamageFormData>>;
}

export const UtilityDamageDamageStep: React.FC<UtilityDamageDamageStepProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Details of damage to utility *</label>
      <textarea 
        value={formData.damageDetails} 
        onChange={e => setFormData({ ...formData, damageDetails: e.target.value })} 
        rows={4} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimated cost of damage *</label>
      <input 
        type="text" 
        value={formData.costEstimate} 
        onChange={e => setFormData({ ...formData, costEstimate: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Utility company *</label>
      <input 
        type="text" 
        value={formData.utilityCompany} 
        onChange={e => setFormData({ ...formData, utilityCompany: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Utility company reference number *</label>
      <input 
        type="text" 
        value={formData.referenceNumber} 
        onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })} 
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white" 
        required 
      />
    </div>
  </div>
);
