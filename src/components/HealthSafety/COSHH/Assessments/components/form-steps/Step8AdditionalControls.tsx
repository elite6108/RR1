import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CoshhAssessment } from '../../types';

interface ControlItem {
  id: string;
  item: string;
}

interface Step8AdditionalControlsProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
  controlItems: ControlItem[];
  setControlItems: (items: ControlItem[]) => void;
}

export const Step8AdditionalControls: React.FC<Step8AdditionalControlsProps> = ({
  formData,
  setFormData,
  controlItems,
  setControlItems
}) => {
  const addControlItem = () => {
    const newItem: ControlItem = {
      id: Date.now().toString(),
      item: ''
    };
    setControlItems([...controlItems, newItem]);
  };

  const removeControlItem = (id: string) => {
    setControlItems(controlItems.filter(item => item.id !== id));
  };

  const updateControlItem = (id: string, value: string) => {
    setControlItems(controlItems.map(item => 
      item.id === id ? { ...item, item: value } : item
    ));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Additional Controls & Monitoring
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Additional Control Items <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        
        {/* Dynamic Control Items */}
        <div className="space-y-3">
          {controlItems.map((item, index) => (
            <div key={item.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Control Item {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeControlItem(item.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Control Item
                </label>
                <textarea
                  value={item.item}
                  onChange={(e) => updateControlItem(item.id, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Describe the control item..."
                />
              </div>
            </div>
          ))}
          
          {/* Add Control Item Button */}
          <button
            type="button"
            onClick={addControlItem}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Control Item
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Further Controls Required <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.further_controls}
          onChange={(e) => setFormData({...formData, further_controls: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe any additional controls that may be needed..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Future improvements, additional equipment, or enhanced procedures needed
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Respiratory Protection <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.respiratory_protection}
          onChange={(e) => setFormData({...formData, respiratory_protection: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Specify respiratory protection requirements..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Type of respiratory protection needed, fit testing requirements
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          PPE Details <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.ppe_details}
          onChange={(e) => setFormData({...formData, ppe_details: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Provide detailed PPE specifications and requirements..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Specific PPE standards, replacement schedules, maintenance requirements
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Monitoring <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.monitoring}
          onChange={(e) => setFormData({...formData, monitoring: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe monitoring procedures and frequency..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Air monitoring, biological monitoring, equipment checks
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Health Surveillance <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          value={formData.health_surveillance}
          onChange={(e) => setFormData({...formData, health_surveillance: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe health surveillance requirements..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Medical examinations, health records, frequency of checks
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Responsibility <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <textarea
            value={formData.responsibility}
            onChange={(e) => setFormData({...formData, responsibility: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Who is responsible for implementation..."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Person or role responsible for control measures
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            By When <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="date"
            value={formData.by_when}
            onChange={(e) => setFormData({...formData, by_when: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Target completion date for implementation
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 8 of 13:</strong> Define additional control measures, monitoring procedures, and health surveillance requirements. 
          Assign responsibilities and set target dates for implementation.
        </p>
      </div>
    </div>
  );
};
