import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface SignageArtwork {
  id: string;
  code: string;
  name: string;
  category: string;
  text_content: string;
  file_path: string;
  signed_url?: string;
}

interface SelectedSign {
  artworkId: string;
  code: string;
  useDefaultText: boolean;
  customText?: string;
}

interface HSSignageSelectorProps {
  artworks: SignageArtwork[];
  selectedSigns: SelectedSign[];
  onSignSelect: (sign: SelectedSign) => void;
  onSignRemove: (artworkId: string) => void;
  onSignUpdate: (sign: SelectedSign) => void;
}

export function HSSignageSelector({
  artworks,
  selectedSigns,
  onSignSelect,
  onSignRemove,
  onSignUpdate,
}: HSSignageSelectorProps) {
  const [selectedSignDetails, setSelectedSignDetails] = useState<SelectedSign | null>(null);
  const [artworksWithUrls, setArtworksWithUrls] = useState<SignageArtwork[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const generateSignedUrl = async (fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('signage-artwork')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
      return data?.signedUrl || '';
    } catch (error) {
      console.error('Error generating signed URL:', error);
      return '';
    }
  };

  useEffect(() => {
    const generateSignedUrls = async () => {
      const artworksWithSignedUrls = await Promise.all(
        artworks.map(async (artwork) => {
          const signedUrl = await generateSignedUrl(artwork.file_path);
          return {
            ...artwork,
            signed_url: signedUrl,
          };
        })
      );
      setArtworksWithUrls(artworksWithSignedUrls);
    };

    if (artworks.length > 0) {
      generateSignedUrls();
    }
  }, [artworks]);

  // Refresh signed URLs every 45 minutes
  useEffect(() => {
    const refreshSignedUrls = async () => {
      const updatedArtworks = await Promise.all(
        artworksWithUrls.map(async (artwork) => {
          const signedUrl = await generateSignedUrl(artwork.file_path);
          return {
            ...artwork,
            signed_url: signedUrl,
          };
        })
      );
      setArtworksWithUrls(updatedArtworks);
    };

    if (artworksWithUrls.length > 0) {
      const interval = setInterval(refreshSignedUrls, 45 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [artworksWithUrls]);

  // Filter artworks based on search query
  const filteredArtworks = artworksWithUrls.filter((artwork) => {
    const query = searchQuery.toLowerCase();
    return (
      artwork.name.toLowerCase().includes(query) ||
      artwork.code.toLowerCase().includes(query) ||
      artwork.category.toLowerCase().includes(query)
    );
  });

  const handleSignClick = (artwork: SignageArtwork) => {
    const isSelected = selectedSigns.some(sign => sign.artworkId === artwork.id);
    
    if (isSelected) {
      // If already selected, deselect it
      onSignRemove(artwork.id);
    } else {
      // If not selected, select it
      // For W001 and M001, allow multiple selections
      if (artwork.code === 'W001' || artwork.code === 'M001') {
        const newSign: SelectedSign = {
          artworkId: artwork.id,
          code: artwork.code,
          useDefaultText: true,
          customText: artwork.text_content,
        };
        onSignSelect(newSign);
      } else {
        const newSign: SelectedSign = {
          artworkId: artwork.id,
          code: artwork.code,
          useDefaultText: true,
          customText: artwork.text_content,
        };
        onSignSelect(newSign);
      }
    }
  };

  const handleTextToggle = (sign: SelectedSign) => {
    onSignUpdate({
      ...sign,
      useDefaultText: !sign.useDefaultText,
      customText: sign.useDefaultText ? '' : sign.customText,
    });
  };

  const handleCustomTextChange = (sign: SelectedSign, text: string) => {
    onSignUpdate({
      ...sign,
      customText: text,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm"
          placeholder="Search signs by name, code, or category..."
        />
      </div>

      {/* Sign Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredArtworks.map((artwork) => {
          const isSelected = selectedSigns.some(sign => sign.artworkId === artwork.id);
          return (
            <div
              key={artwork.id}
              onClick={() => handleSignClick(artwork)}
              className={`relative cursor-pointer border rounded-lg p-4 transition-all duration-200 ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-200 dark:ring-indigo-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md'
              }`}
            >
              <img
                src={artwork.signed_url || ''}
                alt={artwork.name}
                className="w-full h-32 object-contain mb-2"
              />
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{artwork.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{artwork.code}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 capitalize">{artwork.category}</div>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1 shadow-lg">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredArtworks.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            No signs found matching "{searchQuery}"
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Selected Signs List */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Selected Signs ({selectedSigns.length})
        </h3>
        <div className="space-y-4">
          {selectedSigns.map((sign) => {
            const artwork = artworksWithUrls.find(a => a.id === sign.artworkId);
            if (!artwork) return null;

            return (
              <div key={`${sign.artworkId}-${sign.code}`} className="border rounded-lg p-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-start space-x-4">
                  <img
                    src={artwork.signed_url || ''}
                    alt={artwork.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{artwork.name}</div>
                      <button
                        onClick={() => onSignRemove(sign.artworkId)}
                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                        title="Remove sign"
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {artwork.code} • {artwork.category}
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => handleTextToggle(sign)}
                        className={`inline-flex items-center px-3 py-1.5 border ${
                          sign.useDefaultText
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'border-gray-300 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                        } rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                      >
                        {sign.useDefaultText ? '✓ Using Default Text' : 'Use Default Text'}
                      </button>
                      {!sign.useDefaultText && (
                        <textarea
                          value={sign.customText || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCustomTextChange(sign, e.target.value)}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                          rows={3}
                          placeholder="Enter custom text..."
                        />
                      )}
                      {sign.useDefaultText && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                          "{artwork.text_content}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedSigns.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No signs selected. Click on signs above to add them to your board.
          </div>
        )}
      </div>
    </div>
  );
} 