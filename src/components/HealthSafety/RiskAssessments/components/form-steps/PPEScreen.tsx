import React, { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';

interface PPEScreenProps {
  data: {
    selectedPPE: string[];
  };
  onChange: (data: Partial<{ selectedPPE: string[] }>) => void;
}

const PRIORITY_PPE = [
  'Safety Gloves',
  'Safety Footwear',
  'Hi Vis Clothing',
  'Hard Hat',
  'Safety Goggles',
  'Hearing Protection',
  'Protective Clothing',
  'P3 Masks',
  'Face Shield',
  'Respirator Hoods'
];

const OTHER_PPE = [
  'Connect an earth terminal to the ground',
  'Disconnect before carrying out maintenance or repair',
  'Disconnect mains plug from electrical outlet',
  'Disinfect surface',
  'Disinfect your hands',
  'Ensure continuous ventilation',
  'Entry only with supervisor outside',
  'General mandatory action sign',
  'Install locks and keep locked',
  'Install or check guard',
  'Opaque eye protection must be worn',
  'Place trash in the bin',
  'Refer to instruction manual',
  'Secure gas cylinders',
  'Sound your horn',
  'Use barrier cream',
  'Use breathing equipment',
  'Use footbridge',
  'Use footwear with antistatic or antispark features',
  'Use gas detector',
  'Use guard to protect from injury from the table saw',
  'Use handrail',
  'Use protective apron',
  'Use this walkway',
  'Ventilate before and during entering',
  'Wash your hands',
  'Wear a safety harness',
  'Wear a welding mask',
  'Wear safety belts'
];

// Function to get a signed URL for a PPE icon
const getSignedImageUrl = async (filename: string) => {
  if (!filename) return null;
  
  try {
    const { data } = await supabase.storage
      .from('ppe-icons')
      .createSignedUrl(filename, 3600);
      
    return data?.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

// Map of PPE names to their filenames
const PPE_FILENAMES = {
  'Safety Gloves': 'wear-protective-gloves.png',
  'Safety Footwear': 'wear-foot-protection.png',
  'Hi Vis Clothing': 'wear-high-visibility-clothing.png',
  'Hard Hat': 'wear-head-protection.png',
  'Safety Goggles': 'wear-eye-protection.png',
  'Hearing Protection': 'wear-ear-protection.png',
  'Protective Clothing': 'wear-protective-clothing.png',
  'P3 Masks': 'wear-a-mask.png',
  'Face Shield': 'wear-a-face-shield.png',
  'Respirator Hoods': 'wear-respiratory-protection.png',
  'Connect an earth terminal to the ground': 'connect-an-earth-terminal-to-the-ground.png',
  'Disconnect before carrying out maintenance or repair': 'disconnect-before-carrying-out-maintenance-or-repair.png',
  'Disconnect mains plug from electrical outlet': 'disconnect-mains-plug-from-electrical-outlet.png',
  'Disinfect surface': 'disinfect-surface.png',
  'Disinfect your hands': 'disinfect-your-hands.png',
  'Ensure continuous ventilation': 'ensure-continuous-ventilation.png',
  'Entry only with supervisor outside': 'entry-only-with-supervisor-outside.png',
  'General mandatory action sign': 'general-mandatory-action-sign.png',
  'Install locks and keep locked': 'install-locks-and-keep-locked.png',
  'Install or check guard': 'install-or-check-guard.png',
  'Opaque eye protection must be worn': 'opaque-eye-protection-must-be-worn.png',
  'Place trash in the bin': 'place-trash-in-the-bin.png',
  'Refer to instruction manual': 'refer-to-instruction-manual.png',
  'Secure gas cylinders': 'secure-gas-cylinders.png',
  'Sound your horn': 'sound-your-horn.png',
  'Use barrier cream': 'use-barrier-cream.png',
  'Use breathing equipment': 'use-breathing-equipment.png',
  'Use footbridge': 'use-footbridge.png',
  'Use footwear with antistatic or antispark features': 'use-footwear-with-anti-static-or-anti-spark-features.png',
  'Use gas detector': 'use-gas-detector.png',
  'Use guard to protect from injury from the table saw': 'use-guard-to-protect-from-injury-from-the-table-saw.png',
  'Use handrail': 'use-handrail.png',
  'Use protective apron': 'use-protective-apron.png',
  'Use this walkway': 'use-this-walkway.png',
  'Ventilate before and during entering': 'ventilate-before-and-during-entering.png',
  'Wash your hands': 'wash-your-hands.png',
  'Wear a safety harness': 'wear-a-safety-harness.png',
  'Wear a welding mask': 'wear-a-welding-mask.png',
  'Wear safety belts': 'wear-safety-belts.png'
};

export function PPEScreen({ data, onChange }: PPEScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({});
  const [loadingIcons, setLoadingIcons] = useState(true);

  // Load signed URLs for all PPE icons in parallel
  useEffect(() => {
    const loadIconUrls = async () => {
      setLoadingIcons(true);
      try {
        const urlPromises = Object.entries(PPE_FILENAMES).map(async ([ppe, filename]) => {
          const url = await getSignedImageUrl(filename);
          return [ppe, url] as [string, string | null];
        });

        const results = await Promise.all(urlPromises);
        const urls: Record<string, string> = {};
        results.forEach(([ppe, url]) => {
          if (url) {
            urls[ppe] = url;
          }
        });
        setIconUrls(urls);
      } catch (error) {
        console.error('Error loading PPE icons:', error);
      } finally {
        setLoadingIcons(false);
      }
    };

    loadIconUrls();
  }, []);

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const urlPromises = Object.entries(PPE_FILENAMES).map(async ([ppe, filename]) => {
          const url = await getSignedImageUrl(filename);
          return [ppe, url] as [string, string | null];
        });

        const results = await Promise.all(urlPromises);
        const urls: Record<string, string> = {};
        results.forEach(([ppe, url]) => {
          if (url) {
            urls[ppe] = url;
          }
        });
        setIconUrls(urls);
      } catch (error) {
        console.error('Error refreshing PPE icons:', error);
      }
    }, 45 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const togglePPE = (ppe: string) => {
    const newSelected = data.selectedPPE.includes(ppe)
      ? data.selectedPPE.filter(p => p !== ppe)
      : [...data.selectedPPE, ppe];
    
    onChange({ selectedPPE: newSelected });
  };

  const filterPPE = (items: string[]) => {
    return items.filter(ppe => 
      ppe.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">PPE Requirements <span className="text-gray-400 text-xs">(optional)</span></h3>
      
      {/* Search Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search PPE items..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="overflow-y-auto max-h-[300px] space-y-6">
        {/* Priority PPE Section */}
        {(searchQuery === '' || filterPPE(PRIORITY_PPE).length > 0) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500">Common PPE</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filterPPE(PRIORITY_PPE).map((ppe) => {
                const isSelected = data.selectedPPE.includes(ppe);
                return (
                  <button
                    key={ppe}
                    type="button"
                    onClick={() => togglePPE(ppe)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-left transition-colors
                      ${isSelected 
                        ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700' 
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                      } min-h-[80px]
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                        ${isSelected 
                          ? 'bg-indigo-500 border-indigo-500' 
                          : 'border-gray-300'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
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
        {(searchQuery === '' || filterPPE(OTHER_PPE).length > 0) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500">Additional PPE</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filterPPE(OTHER_PPE).map((ppe) => {
                const isSelected = data.selectedPPE.includes(ppe);
                return (
                  <button
                    key={ppe}
                    type="button"
                    onClick={() => togglePPE(ppe)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-left transition-colors
                      ${isSelected 
                        ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700' 
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                      } min-h-[80px]
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`
                        flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                        ${isSelected 
                          ? 'bg-indigo-500 border-indigo-500' 
                          : 'border-gray-300'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
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

        {searchQuery !== '' && filterPPE([...PRIORITY_PPE, ...OTHER_PPE]).length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No PPE items found matching your search
          </div>
        )}
      </div>
    </div>
  );
}