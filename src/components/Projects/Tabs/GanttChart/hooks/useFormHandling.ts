import React from 'react';
import type { FormData } from '../types';

export const useFormHandling = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'start' || name === 'end') {
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      setFormData((prev) => ({
        ...prev,
        [name]: date,
      }));
    } else if (name === 'progress' || name === 'duration') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      type: e.target.value as 'task' | 'milestone' | 'summary' 
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      description: e.target.value 
    }));
  };

  return {
    handleFormChange,
    handleTypeChange,
    handleDescriptionChange,
  };
};
