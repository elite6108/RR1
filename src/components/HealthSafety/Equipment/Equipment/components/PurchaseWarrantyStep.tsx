import React from 'react';
import type { EquipmentFormData } from '../types';

interface PurchaseWarrantyStepProps {
  formData: EquipmentFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function PurchaseWarrantyStep({ formData, onChange }: PurchaseWarrantyStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Purchase <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="date"
            id="purchase_date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="warranty_expiry" className="block text-sm font-medium text-gray-700 mb-2">
            Warranty Expiration <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="date"
            id="warranty_expiry"
            name="warranty_expiry"
            value={formData.warranty_expiry}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
