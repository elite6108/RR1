import React, { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import type { RAMSFormData } from '../../../../../types/rams';
import { PRIORITY_PPE, OTHER_PPE, PPE_FILENAMES } from '../../../../../types/rams';
import { supabase } from '../../../../../lib/supabase';

interface PPEProps {
  data: RAMSFormData;
  onChange: (data: Partial<RAMSFormData>) => void;
}

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

export function PPE({ data, onChange }: PPEProps) {
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
    const newSelected = data.ppe?.includes(ppe)
      ? (data.ppe || []).filter((p) => p !== ppe)
      : [...(data.ppe || []), ppe];

    onChange({ ppe: newSelected });
  };

  const filterPPE = (items: string[]) => {
    return items.filter((ppe) =>
      ppe.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">PPE Requirements *</h3>

      {/* Search Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
                const isSelected = data.ppe?.includes(ppe);
                return (
                  <button
                    key={ppe}
                    type="button"
                    onClick={() => togglePPE(ppe)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-left transition-colors
                      ${
                        isSelected
                          ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                      } min-h-[80px]
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`
                        flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                        ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'border-gray-300'
                        }
                      `}
                      >
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
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
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
            <h4 className="text-sm font-medium text-gray-500">
              Additional PPE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filterPPE(OTHER_PPE).map((ppe) => {
                const isSelected = data.ppe?.includes(ppe);
                return (
                  <button
                    key={ppe}
                    type="button"
                    onClick={() => togglePPE(ppe)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg text-left transition-colors
                      ${
                        isSelected
                          ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                      } min-h-[80px]
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`
                        flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                        ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'border-gray-300'
                        }
                      `}
                      >
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
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
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

        {searchQuery !== '' &&
          filterPPE([...PRIORITY_PPE, ...OTHER_PPE]).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No PPE items found matching your search
            </div>
          )}
      </div>
    </div>
  );
}
