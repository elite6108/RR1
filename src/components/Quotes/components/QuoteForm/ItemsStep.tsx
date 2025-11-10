import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  MoveHorizontal,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import {
  FormField,
  TextInput,
  TextArea,
  NumberInput,
} from '../../../../utils/form';
import type { QuoteItem, QuoteSection } from '../../types';

interface ItemsStepProps {
  formData: {
    sections: QuoteSection[];
  };
  addSection: () => void;
  updateSection: (id: string, title: string) => void;
  updateSectionPrice: (id: string, price: number | null) => void;
  removeSection: (id: string) => void;
  addItem: (sectionId: string) => void;
  updateItem: (
    sectionId: string,
    itemId: string,
    field: keyof QuoteItem,
    value: any
  ) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  moveItem: (
    itemId: string,
    fromSectionId: string,
    toSectionId: string
  ) => void;
  overrideSubtotal: boolean;
  setOverrideSubtotal: (value: boolean) => void;
  includeVat: boolean;
  setIncludeVat: (value: boolean) => void;
  manualSubtotal: number;
  setManualSubtotal: (value: number) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
}

export const ItemsStep = ({
  formData,
  addSection,
  updateSection,
  updateSectionPrice,
  removeSection,
  addItem,
  updateItem,
  removeItem,
  moveItem,
  overrideSubtotal,
  setOverrideSubtotal,
  includeVat,
  setIncludeVat,
  manualSubtotal,
  setManualSubtotal,
  calculateSubtotal,
  calculateTotal,
}) => {
  const totalItems = formData.sections.reduce(
    (sum, section) => sum + section.items.length,
    0
  );

  // Track which sections are expanded (all expanded by default)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(formData.sections.map((s) => s.id))
  );

  // Track which items have the move dropdown open
  const [openMoveDropdown, setOpenMoveDropdown] = useState<string | null>(null);

  // Auto-expand new sections when they're added
  useEffect(() => {
    const currentSectionIds = formData.sections.map((s) => s.id);
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      // Add any new sections
      currentSectionIds.forEach((id) => {
        if (!prev.has(id)) {
          newSet.add(id);
        }
      });
      // Remove any deleted sections
      Array.from(prev).forEach((id) => {
        if (!currentSectionIds.includes(id)) {
          newSet.delete(id);
        }
      });
      return newSet;
    });
  }, [formData.sections.length, formData.sections.map((s) => s.id).join(',')]);

  // Close move dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMoveDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
          setOpenMoveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMoveDropdown]);

  // Toggle section expand/collapse
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Expand all sections
  const expandAll = () => {
    setExpandedSections(new Set(formData.sections.map((s) => s.id)));
  };

  // Collapse all sections
  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-medium">
            Items * (at least one item required)
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Section
            </button>
            {formData.sections.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={expandAll}
                  className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="inline-flex items-center justify-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Collapse All
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-6">
            {formData.sections.map((section, sectionIndex) => {
              const isExpanded = expandedSections.has(section.id);
              const sectionSubtotal = section.items.reduce(
                (sum, item) => sum + (item.price || 0) * (item.qty || 1),
                0
              );

              return (
                <div
                  key={section.id}
                  className="border-2 border-indigo-200 rounded-lg p-4 bg-white"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="inline-flex items-center p-1 hover:bg-gray-100 rounded"
                      title={isExpanded ? 'Collapse section' : 'Expand section'}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                    <MoveHorizontal className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <FormField label={`Section ${sectionIndex + 1} Title`}>
                        <TextInput
                          value={section.title}
                          onChange={(e) =>
                            updateSection(section.id, e.target.value)
                          }
                          placeholder="Enter section title (optional)"
                          className="px-3 py-2 text-base font-medium"
                        />
                      </FormField>
                    </div>
                    {!isExpanded && (
                      <span className="text-sm text-gray-600 px-2">
                        {section.items.length} item
                        {section.items.length !== 1 ? 's' : ''}
                        {sectionSubtotal > 0 &&
                          ` · £${formatNumber(sectionSubtotal)}`}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-900"
                      title="Delete Section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Items in Section - Only show when expanded */}
                  {isExpanded && (
                    <>
                      <div className="space-y-3">
                        {section.items.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-200"
                          >
                            <div className="sm:col-span-1">
                              <FormField label="#">
                                <TextInput
                                  value={item.number}
                                  onChange={(e) =>
                                    updateItem(
                                      section.id,
                                      item.id,
                                      'number',
                                      e.target.value
                                    )
                                  }
                                  className="px-2 py-1 text-sm"
                                  placeholder="1 or A"
                                />
                              </FormField>
                            </div>

                            <div className="sm:col-span-1">
                              <FormField label="QTY" required>
                                <NumberInput
                                  value={item.qty ?? 1}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    updateItem(
                                      section.id,
                                      item.id,
                                      'qty',
                                      isNaN(val) ? 0 : val
                                    );
                                  }}
                                  min={0}
                                  step={1}
                                  className="px-2 py-1 text-sm"
                                />
                              </FormField>
                            </div>

                            <div className="sm:col-span-6">
                              <FormField label="Description" required>
                                <TextArea
                                  value={item.description}
                                  onChange={(e) =>
                                    updateItem(
                                      section.id,
                                      item.id,
                                      'description',
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                  className="px-2 py-1 text-sm"
                                />
                              </FormField>
                            </div>

                            <div className="sm:col-span-2">
                              <FormField
                                label="Amount (£)"
                                description="(optional)"
                              >
                                <NumberInput
                                  value={item.price === null ? '' : item.price}
                                  onChange={(e) =>
                                    updateItem(
                                      section.id,
                                      item.id,
                                      'price',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Optional"
                                  step={0.01}
                                  min={0}
                                  className="px-2 py-1 text-sm"
                                />
                              </FormField>
                            </div>

                            <div className="flex items-start justify-end gap-2 sm:col-span-1 mt-6">
                              {formData.sections.length > 1 && (
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenMoveDropdown(
                                        openMoveDropdown === item.id
                                          ? null
                                          : item.id
                                      )
                                    }
                                    className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-900"
                                    title="Move to another section"
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                  </button>
                                  {openMoveDropdown === item.id && (
                                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                      <div className="py-1">
                                        {formData.sections.map(
                                          (s, idx) =>
                                            s.id !== section.id && (
                                              <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => {
                                                  moveItem(
                                                    item.id,
                                                    section.id,
                                                    s.id
                                                  );
                                                  setOpenMoveDropdown(null);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                              >
                                                Section {idx + 1}
                                                {s.title &&
                                                  `: ${s.title.slice(0, 15)}${
                                                    s.title.length > 15
                                                      ? '...'
                                                      : ''
                                                  }`}
                                              </button>
                                            )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeItem(section.id, item.id)}
                                className="inline-flex items-center px-2 py-1 text-sm text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Item Button for this Section */}
                      <button
                        type="button"
                        onClick={() => addItem(section.id)}
                        className="mt-3 w-full inline-flex items-center justify-center px-3 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item to This Section
                      </button>

                      {/* Section Subtotal / Manual Price */}
                      <div className="mt-3 pt-3 border-t border-indigo-200">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                              Section Price (£):
                            </label>
                            <span className="text-xs text-gray-500">
                              (Leave blank to auto-calculate from items)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <NumberInput
                              value={section.manualPrice ?? ''}
                              onChange={(e) => {
                                const val =
                                  e.target.value === ''
                                    ? null
                                    : parseFloat(e.target.value);
                                updateSectionPrice(
                                  section.id,
                                  isNaN(val as number) ? null : val
                                );
                              }}
                              placeholder={`Auto: £${formatNumber(
                                sectionSubtotal
                              )}`}
                              step={0.01}
                              min={0}
                              className="w-32 px-2 py-1 text-sm"
                            />
                            {section.manualPrice !== null &&
                              section.manualPrice !== undefined && (
                                <span className="text-xs text-gray-600">
                                  (Auto would be: £
                                  {formatNumber(sectionSubtotal)})
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="text-sm font-semibold text-gray-700">
                            Section Total: £
                            {formatNumber(
                              section.manualPrice ?? sectionSubtotal
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {formData.sections.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No sections added yet. Click "Add Section" to start.
            </div>
          )}

          {totalItems === 0 && formData.sections.length > 0 && (
            <div className="text-center py-4 text-amber-600">
              Please add at least one item to a section.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <button
          type="button"
          onClick={() => setOverrideSubtotal(!overrideSubtotal)}
          className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            overrideSubtotal
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {overrideSubtotal ? 'Using Manual Subtotal' : 'Override Subtotal'}{' '}
          <span className="text-gray-400 text-xs">(optional)</span>
        </button>

        <button
          type="button"
          onClick={() => setIncludeVat(!includeVat)}
          className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            includeVat
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {includeVat ? 'VAT Included (20%)' : 'Add 20% VAT'}{' '}
          <span className="text-gray-400 text-xs">(optional)</span>
        </button>
      </div>

      <div className="text-lg font-medium space-y-1 p-4 bg-gray-50 rounded-lg">
        {overrideSubtotal ? (
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Subtotal: £</span>
            <NumberInput
              value={manualSubtotal}
              onChange={(e) =>
                setManualSubtotal(parseFloat(e.target.value) || 0)
              }
              step={0.01}
              min={0}
              className="w-32 px-2 py-1 text-sm"
            />
          </div>
        ) : (
          <div className="text-gray-600">
            Subtotal: £{calculateSubtotal().toFixed(2)}
          </div>
        )}
        {includeVat && (
          <div className="text-gray-600">
            VAT (20%): £{formatNumber(calculateSubtotal() * 0.2)}
          </div>
        )}
        <div className="text-gray-900 font-bold">
          Total: £{formatNumber(calculateTotal())}
        </div>
      </div>
    </div>
  );
};
