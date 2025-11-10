import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import type { ImageThumbnailProps } from '../types';

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ 
  file, 
  className = "", 
  size = "md" 
}) => {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [thumbnailCache] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (thumbnailCache.has(file.id)) {
      setThumbUrl(thumbnailCache.get(file.id)!);
      return;
    }
    
    const generateThumbnail = async () => {
      if (!file.storage_path) return;
      try {
        const { data, error } = await supabase.storage
          .from('company-files')
          .createSignedUrl(file.storage_path, 60 * 5); // 5-minute URL

        if (error) throw error;
        
        setThumbUrl(data.signedUrl);
        thumbnailCache.set(file.id, data.signedUrl);
      } catch (err) {
        console.error('Error generating thumbnail:', err);
      }
    };
    
    generateThumbnail();
  }, [file.id, file.storage_path, thumbnailCache]);

  const sizeClasses = { sm: "h-16 w-16", md: "h-24 w-24", lg: "h-32 w-32" };
  
  if (thumbUrl) {
    return (
      <img 
        src={thumbUrl} 
        alt={file.name} 
        className={`${sizeClasses[size]} ${className} object-cover rounded-md`} 
      />
    );
  }
  
  return (
    <div className={`${sizeClasses[size]} ${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md text-gray-400`}>
      <Image className="h-1/2 w-1/2" />
    </div>
  );
};
