import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { supabase } from '../../../../../lib/supabase';
import { Calendar, createInspectionDateValidator } from '../../../../../utils/calendar';

interface FirstAidKitItem {
  id: number;
  quantity: string;
  description: string;
}

interface ItemInspection {
  itemId: number;
  status: 'yes' | 'no' | null;
  actionNotes: string;
  actualQuantity: string;
}

interface InspectionFormData {
  inspectorName: string;
  inspectionDate: string;
  items: ItemInspection[];
  generalNotes: string;
}

interface InspectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  firstAidKitId?: string;
  kitName?: string;
  existingInspectionId?: string;
  onSuccess?: () => void;
}

// Comprehensive First Aid Kit Items List
const FIRST_AID_KIT_ITEMS: FirstAidKitItem[] = [
  { id: 1, quantity: '2x', description: 'Burn Relief Dressing 10cm x 10cm' },
  { id: 2, quantity: '100x', description: 'Washproof assorted Plasters' },
  { id: 3, quantity: '4x', description: 'Eye Pad Dressing with Bandage' },
  { id: 4, quantity: '3x', description: 'Foil Blanket Adult Size' },
  { id: 5, quantity: '5x', description: 'Large Dressing 18cm x 18cm' },
  { id: 6, quantity: '6x', description: 'Medium Dressing 12cm x 12cm' },
  { id: 7, quantity: '12x', description: 'Nitrile Gloves (Pairs)' },
  { id: 8, quantity: '2x', description: 'Mouth to Mouth Resuscitation Device with Valve' },
  { id: 9, quantity: '4x', description: 'Finger Dressing 3.5cm X 3.5cm' },
  { id: 10, quantity: '1x', description: 'First Aid Guidance leaflet' },
  { id: 11, quantity: '2x', description: 'Conforming Bandage 7.5cm x 4cm' },
  { id: 12, quantity: '3x', description: 'Microporous Tape 2.5cm x 10m' },
  { id: 13, quantity: '40x', description: 'Cleansing Wipes' },
  { id: 14, quantity: '4x', description: 'Triangular Bandage' },
  { id: 15, quantity: '1x', description: 'Universal Shears Small 6"' },
  { id: 16, quantity: '20x', description: 'Adhesive plasters' },
  { id: 17, quantity: '2x', description: 'Sterile eye pads (no.16) (bandage attached)' },
  { id: 18, quantity: '2x', description: 'Individually wrapped triangular bandages' },
  { id: 19, quantity: '6x', description: 'Safety pins' },
  { id: 20, quantity: '1x', description: 'Individually wrapped sterile unmedicated wound dressings - medium (no. 8) (10 x 8cms)' },
  { id: 21, quantity: '1x', description: 'Individually wrapped sterile unmedicated wound dressings - large (no. 9) (13 x 9cms)' },
  { id: 22, quantity: '1x', description: 'Individually wrapped sterile unmedicated wound dressings - extra large (no. 3) (28 x 17.5cms)' },
  { id: 23, quantity: '1x', description: 'Individually wrapped disinfectant wipes' },
  { id: 24, quantity: '1x', description: 'Paramedic shears' },
  { id: 25, quantity: '3x', description: 'Examination gloves' },
  { id: 26, quantity: '2x', description: 'Sterile water where there is no clear running water (20ml)' },
  { id: 27, quantity: '1x', description: 'Pocket face mask' },
  { id: 28, quantity: '1x', description: 'Water based burns dressing - small' },
  { id: 29, quantity: '1x', description: 'Water based burns dressing - large' },
  { id: 30, quantity: '1x', description: 'Crepe bandage (7cm)' },
];

export function InspectionForm({ isOpen, onClose, firstAidKitId, kitName, existingInspectionId, onSuccess }: InspectionFormProps) {
  
  const [formData, setFormData] = useState<InspectionFormData>({
    inspectorName: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    items: FIRST_AID_KIT_ITEMS.map(item => ({
      itemId: item.id,
      status: null,
      actionNotes: '',
      actualQuantity: ''
    })),
    generalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Reset form and fetch current user when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Reset form data when opening modal (unless editing existing inspection)
    if (!existingInspectionId) {
      setFormData({
        inspectorName: '',
        inspectionDate: new Date().toISOString().split('T')[0],
        items: FIRST_AID_KIT_ITEMS.map(item => ({
          itemId: item.id,
          status: null,
          actionNotes: '',
          actualQuantity: ''
        })),
        generalNotes: ''
      });
    }

    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const displayName = user.user_metadata?.display_name || 
                             user.user_metadata?.full_name || 
                             user.email || 
                             'Current User';
          setFormData(prev => ({
            ...prev,
            inspectorName: displayName
          }));
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, [isOpen, existingInspectionId]);

  // Load existing inspection data when editing
  useEffect(() => {
    const loadExistingInspection = async () => {
      if (!existingInspectionId || !isOpen) return;

      try {
        console.log('Loading existing inspection with ID:', existingInspectionId);
        
        // Fetch the main inspection record
        const { data: inspectionData, error: inspectionError } = await supabase
          .from('first_aid_kit_inspections')
          .select('*')
          .eq('id', existingInspectionId)
          .single();

        if (inspectionError) throw inspectionError;
        console.log('Loaded inspection data:', inspectionData);

        // Fetch the inspection items
        const { data: itemsData, error: itemsError } = await supabase
          .from('first_aid_kit_inspection_items')
          .select('*')
          .eq('inspection_id', existingInspectionId);

        if (itemsError) throw itemsError;
        console.log('Loaded inspection items:', itemsData);

        // Update form data with existing inspection data
        const updatedFormData = {
          inspectorName: inspectionData.inspector_name,
          inspectionDate: inspectionData.inspection_date,
          generalNotes: inspectionData.general_notes || '',
          items: FIRST_AID_KIT_ITEMS.map(kitItem => {
            const existingItem = itemsData.find(item => item.item_id === kitItem.id);
            return {
              itemId: kitItem.id,
              status: existingItem ? existingItem.status : null,
              actionNotes: existingItem ? existingItem.action_notes || '' : '',
              actualQuantity: existingItem ? existingItem.actual_quantity || '' : ''
            };
          })
        };
        
        console.log('Updated form data:', updatedFormData);
        setFormData(updatedFormData);
      } catch (error) {
        console.error('Error loading existing inspection:', error);
      }
    };

    loadExistingInspection();
  }, [existingInspectionId, isOpen]);

  const handleItemStatusChange = (itemId: number, status: 'yes' | 'no' | null) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.itemId === itemId ? { ...item, status } : item
      )
    }));
  };

  const handleItemNotesChange = (itemId: number, actionNotes: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.itemId === itemId ? { ...item, actionNotes } : item
      )
    }));
  };

  const handleActualQuantityChange = (itemId: number, actualQuantity: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.itemId === itemId ? { ...item, actualQuantity } : item
      )
    }));
  };



  // Date validation for inspection forms
  const isDateDisabled = createInspectionDateValidator();

  const handleDateSelect = (dateStr: string) => {
    setFormData(prev => ({ ...prev, inspectionDate: dateStr }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.inspectorName.trim()) {
      newErrors.inspectorName = 'Inspector name is required';
    }
    
    if (!formData.inspectionDate) {
      newErrors.inspectionDate = 'Inspection date is required';
    }

    // Check if all items have been inspected
    const uninspectedItems = formData.items.filter(item => item.status === null);
    if (uninspectedItems.length > 0) {
      newErrors.items = `${uninspectedItems.length} items still need to be inspected`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate inspection statistics
      const passedItems = formData.items.filter(item => item.status === 'yes').length;
      const failedItems = formData.items.filter(item => item.status === 'no').length;
      const totalItems = formData.items.length;

      // Determine overall status
      let overallStatus: 'passed' | 'failed' | 'needs_attention' = 'passed';
      if (failedItems > 0) {
        overallStatus = failedItems > totalItems / 2 ? 'failed' : 'needs_attention';
      }

      // Save or update main inspection record
      let inspectionData;
      let inspectionError;

      if (existingInspectionId) {
        // Update existing inspection
        const result = await supabase
          .from('first_aid_kit_inspections')
          .update({
            inspector_name: formData.inspectorName,
            inspection_date: formData.inspectionDate,
            general_notes: formData.generalNotes,
            overall_status: overallStatus,
            items_inspected: totalItems,
            items_passed: passedItems,
            items_failed: failedItems
          })
          .eq('id', existingInspectionId)
          .select()
          .single();
        
        inspectionData = result.data;
        inspectionError = result.error;
      } else {
        // Create new inspection
        const result = await supabase
          .from('first_aid_kit_inspections')
          .insert([{
            user_id: user.id,
            first_aid_kit_id: firstAidKitId,
            inspector_name: formData.inspectorName,
            inspection_date: formData.inspectionDate,
            general_notes: formData.generalNotes,
            overall_status: overallStatus,
            items_inspected: totalItems,
            items_passed: passedItems,
            items_failed: failedItems
          }])
          .select()
          .single();
        
        inspectionData = result.data;
        inspectionError = result.error;
      }

      if (inspectionError) throw inspectionError;

      // Handle individual item inspection results
      if (existingInspectionId) {
        // Delete existing inspection items first
        await supabase
          .from('first_aid_kit_inspection_items')
          .delete()
          .eq('inspection_id', existingInspectionId);
      }

      // Insert updated inspection items
      console.log('Form data items before filtering:', formData.items);
      
      const inspectionItems = formData.items
        .filter(item => item.status !== null) // Only save items that were actually inspected
        .map(item => {
          const kitItem = FIRST_AID_KIT_ITEMS.find(ki => ki.id === item.itemId);
          return {
            inspection_id: inspectionData.id,
            item_id: item.itemId,
            item_description: kitItem?.description || 'Unknown Item',
            recommended_quantity: kitItem?.quantity || '0x',
            expected_quantity: kitItem?.quantity || '0x',
            actual_quantity: item.actualQuantity || '0',
            status: item.status,
            action_notes: item.actionNotes || ''
          };
        });

      console.log('Inspection items to save:', inspectionItems);

      if (inspectionItems.length > 0) {
        console.log('Saving inspection items to database...');
        const { error: itemsError } = await supabase
          .from('first_aid_kit_inspection_items')
          .insert(inspectionItems);

        if (itemsError) {
          console.error('Error saving inspection items:', itemsError);
          throw itemsError;
        }
        console.log('Inspection items saved successfully');
      } else {
        console.warn('No inspection items to save - all items have null status');
      }

      // Update the first aid kit's last inspection date
      if (firstAidKitId) {
        const { error: updateError } = await supabase
          .from('first_aid_kits')
          .update({ 
            last_inspection_date: formData.inspectionDate,
            status: overallStatus === 'passed' ? 'active' : 'needs_inspection'
          })
          .eq('id', firstAidKitId);

        if (updateError) console.warn('Error updating kit inspection date:', updateError);
      }

      console.log('Inspection saved successfully:', inspectionData);
      
      // Call success callback to refresh data
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal after successful submission
      onClose();
    } catch (error) {
      console.error('Error saving inspection:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Show more detailed error message
      let errorMessage = 'Error saving inspection. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error saving inspection: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = `Error saving inspection: ${JSON.stringify(error)}`;
      }
      
      alert(errorMessage);
    }
  };



  const getCompletionStats = () => {
    const completed = formData.items.filter(item => item.status !== null).length;
    const total = formData.items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  if (!isOpen) return null;

  const stats = getCompletionStats();

  return createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto flex items-center justify-center z-50 p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {existingInspectionId ? 'Edit' : 'Create'} First Aid Kit Inspection
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {kitName && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Inspecting: {kitName}
            </p>
                     </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress: {stats.completed} of {stats.total} items
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stats.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inspector Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inspector Name *
              </label>
              <input
                type="text"
                value={formData.inspectorName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, inspectorName: e.target.value }))}
                disabled={true}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
                placeholder={isLoadingUser ? "Loading..." : "Inspector name"}
              />
              {errors.inspectorName && (
                <p className="text-red-500 text-xs mt-1">{errors.inspectorName}</p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inspection Date *
              </label>
              <Calendar
                selectedDate={formData.inspectionDate}
                onDateSelect={handleDateSelect}
                isDisabled={isDateDisabled}
                placeholder="Select inspection date"
              />
              {errors.inspectionDate && (
                <p className="text-red-500 text-xs mt-1">{errors.inspectionDate}</p>
              )}
            </div>
          </div>

          {/* Items Checklist */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Items Checklist
            </h4>
            {errors.items && (
              <p className="text-red-500 text-sm mb-4">{errors.items}</p>
            )}
            
            <div className="space-y-3">
              <div className="grid grid-cols-8 gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                <div className="col-span-1">Item</div>
                <div className="col-span-1">Rec. QTY</div>
                <div className="col-span-1">Act. QTY</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2">Included</div>
              </div>
              
              {FIRST_AID_KIT_ITEMS.map((item) => {
                const itemInspection = formData.items.find(i => i.itemId === item.id);
                return (
                  <div key={item.id} className="space-y-2">
                    {/* Main item row */}
                    <div className="grid grid-cols-8 gap-2 items-center py-2">
                      <div className="col-span-1 text-sm text-gray-600 dark:text-gray-400">
                        {item.id}
                      </div>
                      <div className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.quantity}
                      </div>
                      <div className="col-span-1">
                        <input
                          type="text"
                          value={itemInspection?.actualQuantity || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleActualQuantityChange(item.id, e.target.value)}
                          placeholder="0"
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="col-span-3 text-sm text-gray-700 dark:text-gray-300">
                        {item.description}
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleItemStatusChange(item.id, 'yes')}
                          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                            itemInspection?.status === 'yes'
                              ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200 dark:bg-green-700 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-600'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleItemStatusChange(item.id, 'no')}
                          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                            itemInspection?.status === 'no'
                              ? 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 dark:bg-red-700 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-600'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    
                    {/* Action notes row - only show when status is 'no' */}
                    {itemInspection?.status === 'no' && (
                      <div className="grid grid-cols-8 gap-2 pb-2">
                        <div className="col-span-1"></div>
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={itemInspection?.actionNotes || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemNotesChange(item.id, e.target.value)}
                            placeholder="Action notes..."
                            className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                          />
                        </div>
                        <div className="col-span-2"></div>
                      </div>
                    )}
                    
                    <div className="border-b border-gray-100 dark:border-gray-700"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* General Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              General Notes
            </label>
            <textarea
              rows={4}
              value={formData.generalNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, generalNotes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter any additional notes about the inspection..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {existingInspectionId ? 'Update' : 'Save'} Inspection
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
