import React from 'react';
import { Search } from 'lucide-react';
import { CoshhAssessment, PRIORITY_PPE, OTHER_PPE } from '../../types';

interface Step2HazardsPPEProps {
  formData: CoshhAssessment;
  setFormData: (data: CoshhAssessment) => void;
  ppeSearchQuery: string;
  setPpeSearchQuery: (query: string) => void;
  iconUrls: Record<string, string>;
  loadingIcons: boolean;
}

export const Step2HazardsPPE: React.FC<Step2HazardsPPEProps> = ({
  formData,
  setFormData,
  ppeSearchQuery,
  setPpeSearchQuery,
  iconUrls,
  loadingIcons
}) => {
  const toggleArrayValue = (array: string[], value: string): string[] => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    } else {
      return [...array, value];
    }
  };

  const togglePPE = (ppe: string) => {
    setFormData({
      ...formData,
      selected_ppe: toggleArrayValue(formData.selected_ppe, ppe)
    });
  };

  const filterPPE = (ppeList: string[]) => {
    if (!ppeSearchQuery) return ppeList;
    return ppeList.filter(ppe => 
      ppe.toLowerCase().includes(ppeSearchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Hazards & PPE Selection
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Routes of Entry <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Inhalation', 'Absorption', 'Ingestion'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFormData({
                ...formData, 
                routes_of_entry: toggleArrayValue(formData.routes_of_entry, option)
              })}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                formData.routes_of_entry.includes(option)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select PPE <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        
        {/* PPE Search Box */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={ppeSearchQuery}
            onChange={(e) => setPpeSearchQuery(e.target.value)}
            placeholder="Search PPE items..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
          />
        </div>

        {/* PPE Selection Grid */}
        <div className="overflow-y-auto max-h-[400px] space-y-4">
          {/* Priority PPE Section */}
          {(ppeSearchQuery === '' || filterPPE(PRIORITY_PPE).length > 0) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Common PPE</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filterPPE(PRIORITY_PPE).map((ppe) => {
                  const isSelected = formData.selected_ppe.includes(ppe);
                  return (
                    <button
                      key={ppe}
                      type="button"
                      onClick={() => togglePPE(ppe)}
                      className={`
                        flex items-center px-4 py-3 rounded-lg text-left transition-colors
                        ${isSelected 
                          ? 'bg-indigo-50 dark:bg-indigo-900/50 border-2 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                          : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } min-h-[80px]
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`
                          flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                          ${isSelected 
                            ? 'bg-indigo-500 border-indigo-500' 
                            : 'border-gray-300 dark:border-gray-600'
                          }
                        `}>
                          {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <div className="flex-1 flex items-center space-x-3">
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                            {loadingIcons ? (
                              <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                            ) : iconUrls[ppe] ? (
                              <img 
                                src={iconUrls[ppe]}
                                alt={ppe}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                          </div>
                          <span className="text-sm font-medium">{ppe}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other PPE Section */}
          {(ppeSearchQuery === '' || filterPPE(OTHER_PPE).length > 0) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional PPE</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filterPPE(OTHER_PPE).map((ppe) => {
                  const isSelected = formData.selected_ppe.includes(ppe);
                  return (
                    <button
                      key={ppe}
                      type="button"
                      onClick={() => togglePPE(ppe)}
                      className={`
                        flex items-center px-4 py-3 rounded-lg text-left transition-colors
                        ${isSelected 
                          ? 'bg-indigo-50 dark:bg-indigo-900/50 border-2 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                          : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        } min-h-[80px]
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`
                          flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                          ${isSelected 
                            ? 'bg-indigo-500 border-indigo-500' 
                            : 'border-gray-300 dark:border-gray-600'
                          }
                        `}>
                          {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <div className="flex-1 flex items-center space-x-3">
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                            {loadingIcons ? (
                              <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                            ) : iconUrls[ppe] ? (
                              <img 
                                src={iconUrls[ppe]}
                                alt={ppe}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                          </div>
                          <span className="text-sm font-medium">{ppe}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {ppeSearchQuery !== '' && filterPPE([...PRIORITY_PPE, ...OTHER_PPE]).length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No PPE items found matching your search
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location of PPE <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          type="text"
          value={formData.ppe_location}
          onChange={(e) => setFormData({...formData, ppe_location: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Step 2 of 13:</strong> Select the routes of entry for the substance and choose appropriate PPE. 
          Use the search function to quickly find specific PPE items.
        </p>
      </div>
    </div>
  );
};