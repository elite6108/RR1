import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { HSSignageSelector } from './HSSignageSelector';
import { supabase } from '../../../lib/supabase';

interface SignageArtwork {
  id: string;
  code: string;
  name: string;
  category: string;
  text_content: string;
  file_path: string;
}

interface SelectedSign {
  artworkId: string;
  code: string;
  useDefaultText: boolean;
  customText?: string;
}

interface Site {
  id: string;
  name: string;
}

interface HSBoardSignageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: string;
    title: string;
    size: string;
    orientation: string;
    status: string;
    site: string;
    signs: Array<{ artworkId: string; code: string }>;
    text: Record<string, { useDefaultText: boolean; customText?: string }>;
  }) => void;
  editData?: {
    id: string;
    title: string;
    size: string;
    orientation: string;
    status: string;
    site: string;
    signs: Array<{ artworkId: string; code: string }>;
    text: Record<string, { useDefaultText: boolean; customText?: string }>;
    created_at: string;
    updated_at: string;
    created_by: string;
  } | null;
}

const SIZES = [
  '300 x 200 mm',
  '400 x 300 mm',
  '600 x 450 mm',
  '800 x 600 mm',
  '900mm x 1200mm'
];

const ORIENTATIONS = ['Portrait', 'Landscape'];

const COMMON_SIGNS = ['MO14', 'M003', 'M004', 'M008', 'M015', 'M016', 'No Access', 'P002', 'M009', 'E003'];

export function HSBoardSignageModal({ isOpen, onClose, onSave, editData }: HSBoardSignageModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [size, setSize] = useState(SIZES[0]);
  const [orientation, setOrientation] = useState(ORIENTATIONS[0]);
  const [selectedSigns, setSelectedSigns] = useState<SelectedSign[]>([]);
  const [usePreselectedSigns, setUsePreselectedSigns] = useState(false);
  const [artworks, setArtworks] = useState<SignageArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchArtworks();
    fetchSites();
  }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (editData && sites.length > 0) {
      setSize(editData.size);
      setOrientation(editData.orientation);
      setSelectedSite(editData.site);
      
      // Convert signs data to SelectedSign format
      const convertedSigns: SelectedSign[] = editData.signs.map(sign => ({
        artworkId: sign.artworkId,
        code: sign.code,
        useDefaultText: editData.text[sign.artworkId]?.useDefaultText ?? true,
        customText: editData.text[sign.artworkId]?.customText
      }));
      
      setSelectedSigns(convertedSigns);
    } else if (!editData) {
      // Reset form for new board
      setSize(SIZES[0]);
      setOrientation(ORIENTATIONS[0]);
      setSelectedSigns([]);
      setUsePreselectedSigns(false);
      setCurrentStep(1);
      if (sites.length > 0) {
        setSelectedSite(sites[0].id);
      }
    }
  }, [editData, sites]);

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('id, name')
        .order('name');

      if (error) throw error;
      if (data) {
        setSites(data);
        if (data.length > 0) {
          setSelectedSite(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      // Fetch all files from storage using pagination
      let allFiles = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const { data: filesData, error: filesError } = await supabase.storage
          .from('signage-artwork')
          .list('', {
            limit: limit,
            offset: offset,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (filesError) throw filesError;
        if (!filesData || filesData.length === 0) break;

        allFiles = [...allFiles, ...filesData];
        if (filesData.length < limit) break;
        offset += limit;
      }

      // Fetch metadata from database
      const { data: metadataData, error: metadataError } = await supabase
        .from('signage_artwork')
        .select('file_name, display_name, category');

      if (metadataError) throw metadataError;

      const metadataMap = new Map(
        metadataData?.map((m) => [m.file_name, { display_name: m.display_name, category: m.category }]) || []
      );

      // Create artwork objects from files
      const artworkFiles = allFiles
        ?.filter((file) => /\.(jpg|jpeg|png|svg)$/i.test(file.name))
        .map((file) => {
          const metadata = metadataMap.get(file.name);
          const displayName = metadata?.display_name || file.name.replace(/\.[^/.]+$/, '');
          
          // Extract code from display name (assuming format like "W001 - Warning Sign")
          const codeMatch = displayName.match(/^([A-Z]\d{3})/);
          const code = codeMatch ? codeMatch[1] : 'UNKNOWN';
          
          return {
            id: file.id,
            code: code,
            name: displayName,
            category: metadata?.category || 'mandatory',
            text_content: displayName, // Use display name as default text
            file_path: file.name, // This is the actual file name in storage
          };
        }) || [];

      // Sort files alphabetically by display name
      artworkFiles.sort((a, b) => a.name.localeCompare(b.name));
      setArtworks(artworkFiles);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Prepare signs and text data
      const signsData = selectedSigns.map(sign => ({
        artworkId: sign.artworkId,
        code: sign.code
      }));

      const textData = selectedSigns.reduce((acc, sign) => {
        acc[sign.artworkId] = {
          useDefaultText: sign.useDefaultText,
          customText: sign.customText
        };
        return acc;
      }, {} as Record<string, { useDefaultText: boolean; customText?: string }>);

      const boardData = {
        title: `${size} ${orientation} Board`,
        size,
        orientation,
        status: editData?.status || 'draft',
        site: selectedSite,
        signs: signsData,
        text: textData
      };

      let data, error;

      if (editData) {
        // Update existing board
        const updateResult = await supabase
          .from('signage_board')
          .update({
            ...boardData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editData.id)
          .select('id, title, size, orientation, status, site, signs, text')
          .single();
        
        data = updateResult.data;
        error = updateResult.error;
      } else {
        // Create new board
        const insertResult = await supabase
          .from('signage_board')
          .insert([{
            ...boardData,
            created_by: userData.user.id
          }])
          .select('id, title, size, orientation, status, site, signs, text')
          .single();
        
        data = insertResult.data;
        error = insertResult.error;
      }

      if (error) throw error;

      if (data) {
        onSave({
          id: data.id,
          title: data.title,
          size: data.size,
          orientation: data.orientation,
          status: data.status,
          site: data.site,
          signs: data.signs,
          text: data.text
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving board:', error);
    }
  };

  const handleSignSelect = (sign: SelectedSign) => {
    setSelectedSigns([...selectedSigns, sign]);
  };

  const handleSignRemove = (artworkId: string) => {
    setSelectedSigns(selectedSigns.filter(sign => sign.artworkId !== artworkId));
  };

  const handleSignUpdate = (updatedSign: SelectedSign) => {
    setSelectedSigns(selectedSigns.map(sign => 
      sign.artworkId === updatedSign.artworkId ? updatedSign : sign
    ));
  };

  const togglePreselectedSigns = () => {
    setUsePreselectedSigns(!usePreselectedSigns);
    if (!usePreselectedSigns) {
      // Add common signs
      const commonArtworks = artworks.filter(artwork => 
        COMMON_SIGNS.includes(artwork.code) || 
        artwork.name.toLowerCase().includes('no access') ||
        artwork.code.toLowerCase().includes('no access')
      );
      
      const newSigns = commonArtworks.map(artwork => ({
        artworkId: artwork.id,
        code: artwork.code,
        useDefaultText: true,
        customText: artwork.text_content,
      }));

      // Filter out signs that are already selected to avoid duplicates
      const existingArtworkIds = selectedSigns.map(sign => sign.artworkId);
      const uniqueNewSigns = newSigns.filter(sign => !existingArtworkIds.includes(sign.artworkId));

      setSelectedSigns([...selectedSigns, ...uniqueNewSigns]);
    } else {
      // Remove common signs when toggling off
      const commonArtworkIds = artworks
        .filter(artwork => 
          COMMON_SIGNS.includes(artwork.code) || 
          artwork.name.toLowerCase().includes('no access') ||
          artwork.code.toLowerCase().includes('no access')
        )
        .map(artwork => artwork.id);
      
      setSelectedSigns(selectedSigns.filter(sign => !commonArtworkIds.includes(sign.artworkId)));
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const steps = [
    { number: 1, name: 'Size & Orientation' },
    { number: 2, name: 'Select Signs' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg w-full max-w-4xl mx-4 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editData ? 'Edit Board' : 'Create New Board'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step) => (
                <div key={step.name} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step.number
                        ? 'bg-indigo-600 text-white'
                        : currentStep > step.number
                        ? 'bg-indigo-200 text-indigo-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {step.number}
                  </div>
                  {step.number < steps.length && (
                    <div
                      className={`h-1 w-12 ${
                        currentStep > step.number ? 'bg-indigo-200' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-sm text-gray-600">
                {currentStep === 1 && 'Size & Orientation'}
                {currentStep === 2 && 'Select Signs'}
              </span>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Site
                  </label>
                  <select
                    value={selectedSite}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSite(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOrientation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {ORIENTATIONS.map((orientation) => (
                      <option key={orientation} value={orientation}>
                        {orientation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={togglePreselectedSigns}
                    className={`inline-flex items-center px-4 py-2 border ${
                      usePreselectedSigns 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                        : 'border-gray-300 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                    } rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {usePreselectedSigns ? (
                      <span>✓ Using Common Signs</span>
                    ) : (
                      <span>Preselect Common Signs</span>
                    )}
                  </button>
                  
                  <button
                    onClick={scrollToBottom}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Scroll to bottom
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait for the images to load. Note: You can select W001 Warning, and M001 Mandatory multiple times. <br /> When you select your signs, you will be able to customise the text for the sign at the bottom of this page.
                </p>

                <div ref={scrollContainerRef} className="max-h-[500px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading signs...</p>
                    </div>
                  ) : (
                    <HSSignageSelector
                      artworks={artworks}
                      selectedSigns={selectedSigns}
                      onSignSelect={handleSignSelect}
                      onSignRemove={handleSignRemove}
                      onSignUpdate={handleSignUpdate}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50'
              } px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {currentStep === steps.length ? 'Save' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 