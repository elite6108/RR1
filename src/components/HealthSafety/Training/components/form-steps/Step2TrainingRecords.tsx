import React from 'react';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import type { FormStepProps, TrainingRecord } from '../../types';
import { INPUT_CLASS_NAME, trainingItemsByCategory, allTrainingItems } from '../../utils/constants';
import { Calendar } from '../../../../../utils/calendar/Calendar';

export function Step2TrainingRecords({ 
  trainingRecords = [], 
  setTrainingRecords, 
  expandedTrainingItems = [], 
  setExpandedTrainingItems 
}: FormStepProps) {

  const addTrainingRecord = () => {
    const newRecord: TrainingRecord = {
      training_item_id: '',
      stage: 'booked_in',
      date_added: new Date().toISOString().split('T')[0],
      expiry_date: '',
      status: 'no_training'
    };
    setTrainingRecords?.([...trainingRecords, newRecord]);
  };

  const updateTrainingRecord = (index: number, field: keyof TrainingRecord, value: string) => {
    const newRecords = [...trainingRecords];
    (newRecords[index] as any)[field] = value;
    setTrainingRecords?.(newRecords);
  };

  const toggleTrainingItem = (index: number) => {
    setExpandedTrainingItems?.(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const renderTrainingOptions = () => {
    return Object.entries(trainingItemsByCategory).map(([category, items]) => (
      <optgroup key={category} label={category}>
        {items.map(item => (
          <option key={item.id} value={item.id}>
            {item.training_name}
          </option>
        ))}
      </optgroup>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Training Records <span className="text-gray-400 text-xs">(optional)</span>
        </h3>
        <button
          type="button"
          onClick={addTrainingRecord}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Training
        </button>
      </div>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {trainingRecords.map((record, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleTrainingItem(index)}
              className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {allTrainingItems.find(item => item.id === record.training_item_id)?.training_name || 'New Training'}
              </span>
              {expandedTrainingItems.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedTrainingItems.includes(index) && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Training</label>
                    <select
                      value={record.training_item_id}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        updateTrainingRecord(index, 'training_item_id', e.target.value);
                      }}
                      className={INPUT_CLASS_NAME}
                    >
                      <option value="">Select training</option>
                      {renderTrainingOptions()}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stage</label>
                    <select
                      value={record.stage}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        updateTrainingRecord(index, 'stage', e.target.value);
                      }}
                      className={INPUT_CLASS_NAME}
                    >
                      <option value="booked_in">Booked In</option>
                      <option value="booked">Booked</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Added</label>
                    <Calendar
                      selectedDate={record.date_added}
                      onDateSelect={(date: string) => updateTrainingRecord(index, 'date_added', date)}
                      placeholder="Select date added"
                      className=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <Calendar
                      selectedDate={record.expiry_date}
                      onDateSelect={(date: string) => updateTrainingRecord(index, 'expiry_date', date)}
                      placeholder="Select expiry date"
                      className=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={record.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        updateTrainingRecord(index, 'status', e.target.value);
                      }}
                      className={INPUT_CLASS_NAME}
                    >
                      <option value="completed">Completed</option>
                      <option value="no_training">No Training</option>
                      <option value="needs_support">Needs Support</option>
                      <option value="needs_training">Needs Training</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}