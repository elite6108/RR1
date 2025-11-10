import React from 'react';
import { Search } from 'lucide-react';
import { CoshhAssessment, HAZARDS } from '../../types';

interface Step6HazardSelectionProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
  hazardSearchQuery: string;
  setHazardSearchQuery: (query: string) => void;
  hazardIconUrls: Record<string, string>;
  loadingHazardIcons: boolean;
}

export const Step6HazardSelection: React.FC<Step6HazardSelectionProps> = ({
  formData,
  setFormData,
  hazardSearchQuery,
  setHazardSearchQuery,
  hazardIconUrls,
  loadingHazardIcons
}) => {
  const toggleHazard = (hazard: string) => {
    const currentHazards = formData.selected_hazards || [];
    const newHazards = currentHazards.includes(hazard)
      ? currentHazards.filter(h => h !== hazard)
      : [...currentHazards, hazard];
    
    setFormData({
      ...formData,
      selected_hazards: newHazards
    });
  };

  const filterHazards = (hazardList: string[]) => {
    if (!hazardSearchQuery) return hazardList;
    return hazardList.filter(hazard => 
      hazard.toLowerCase().includes(hazardSearchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Hazard Symbol Selection
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select the hazards <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        
        {/* Hazard Search Box */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={hazardSearchQuery}
            onChange={(e) => setHazardSearchQuery(e.target.value)}
            placeholder="Search hazard types..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
          />
        </div>

        {/* Hazard Selection Grid */}
        <div className="overflow-y-auto max-h-[500px] space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hazard Symbols</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filterHazards(HAZARDS).map((hazard) => {
                const isSelected = formData.selected_hazards?.includes(hazard) || false;
                return (
                  <button
                    key={hazard}
                    type="button"
                    onClick={() => toggleHazard(hazard)}
                    className={`
                      flex flex-col items-center p-4 rounded-lg text-center transition-colors
                      ${isSelected 
                        ? 'bg-red-50 dark:bg-red-900/50 border-2 border-red-500 text-red-700 dark:text-red-300' 
                        : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      } min-h-[140px]
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mb-2
                      ${isSelected 
                        ? 'bg-red-500 border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                      }
                    `}>
                      {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      {loadingHazardIcons ? (
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
                      ) : hazardIconUrls[hazard] ? (
                        <img 
                          src={hazardIconUrls[hazard]}
                          alt={hazard}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">No Icon</span>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-xs font-medium text-center leading-tight">{hazard}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {hazardSearchQuery !== '' && filterHazards(HAZARDS).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <p>No hazard types found matching your search</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Hazards Summary */}
      {formData.selected_hazards && formData.selected_hazards.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Selected Hazards ({formData.selected_hazards.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.selected_hazards.map((hazard) => (
              <span 
                key={hazard}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
              >
                {hazard}
                <button
                  type="button"
                  onClick={() => toggleHazard(hazard)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-red-600 hover:bg-red-200 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Hazard Symbol Guide
        </h4>
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Select all hazard symbols that appear on the substance's label or safety data sheet. 
          These symbols indicate specific types of dangers and help determine appropriate safety measures.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 6 of 13:</strong> Select all applicable hazard symbols for this substance. 
          These are typically found on the product label and in Section 2 of the Safety Data Sheet.
        </p>
      </div>
    </div>
  );
};
