import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PER_OPTIONS, calculateItemTotal, calculateSubtotal, calculateVat, calculateTotal, formatNumber } from '../../utils/constants';
import { FormField, TextInput, NumberInput, Select } from '../../../../../utils/form';
import type { FormStepProps } from '../../types';

export function Step2Items({
  formData,
  loading = false,
  includeVat = false,
  handleItemChange,
  addItem,
  removeItem,
  setIncludeVat,
}: FormStepProps) {
  const subtotal = calculateSubtotal(formData.items || []);
  const vat = calculateVat(subtotal, includeVat);
  const total = calculateTotal(subtotal, vat);

  const perOptions = PER_OPTIONS.map(option => ({ value: option, label: option }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Items</h3>
        <button
          type="button"
          onClick={addItem}
          disabled={loading}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {formData.items && formData.items.length > 0 ? (
        <div className="space-y-4">
          {formData.items.map((item: any, index: number) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <FormField label="Description" required>
                    <TextInput
                      value={item.description || ''}
                      onChange={(e) => handleItemChange?.(index, 'description', e.target.value)}
                      placeholder="Item description"
                      disabled={loading}
                    />
                  </FormField>
                </div>
                <div>
                  <FormField label="Quantity" required>
                    <NumberInput
                      value={item.quantity || 0}
                      onChange={(e) => handleItemChange?.(index, 'quantity', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                      disabled={loading}
                    />
                  </FormField>
                </div>
                <div>
                  <FormField label="Price (£)" required>
                    <NumberInput
                      value={item.price || 0}
                      onChange={(e) => handleItemChange?.(index, 'price', parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                      disabled={loading}
                    />
                  </FormField>
                </div>
                <div>
                  <FormField label="Per" required>
                    <Select
                      value={item.per || 'Each'}
                      onChange={(e) => handleItemChange?.(index, 'per', e.target.value)}
                      options={perOptions}
                      disabled={loading}
                    />
                  </FormField>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total: £{formatNumber(calculateItemTotal(item.quantity || 0, item.price || 0))}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem?.(index)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Remove Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No items added yet. Click "Add Item" to get started.
        </div>
      )}

      {/* Totals Section */}
      {formData.items && formData.items.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-900 dark:text-white">£{formatNumber(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeVat"
                  checked={includeVat}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncludeVat?.(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="includeVat" className="ml-2 text-gray-600 dark:text-gray-400">
                  Include VAT (20%)
                </label>
              </div>
              <span className="text-gray-900 dark:text-white">£{formatNumber(vat)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-gray-900 dark:text-white">Total:</span>
              <span className="text-gray-900 dark:text-white">£{formatNumber(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}