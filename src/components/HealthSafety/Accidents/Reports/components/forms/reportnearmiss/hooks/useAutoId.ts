import { useState, useEffect } from 'react';
import { supabase } from '../../../../../../../../lib/supabase';

export function useAutoId(
  tableName: string,
  prefix: string,
  isEditing: boolean,
  initialData?: any
) {
  const [autoId, setAutoId] = useState(() => {
    if (isEditing && (initialData?.autoId || initialData?.auto_id)) {
      return initialData.autoId || initialData.auto_id;
    }
    return ''; // Start empty instead of default value
  });
  const [isLoadingId, setIsLoadingId] = useState(!isEditing);

  useEffect(() => {
    if (!isEditing) {
      const getNextId = async () => {
        setIsLoadingId(true);
        try {
          // Get the next sequential number from Supabase, filtering out empty auto_ids
          const { data, error } = await supabase
            .from(tableName)
            .select('auto_id')
            .not('auto_id', 'is', null)
            .not('auto_id', 'eq', '')
            .order('auto_id', { ascending: false })
            .limit(1);

          if (error) {
            console.error('Error getting last report number:', error);
            const defaultId = `${prefix}-00001`;
            setAutoId(defaultId);
            return;
          }

          if (data && data.length > 0 && data[0].auto_id) {
            // Extract number from the last auto_id (e.g., "DO-00005" -> 5)
            const lastAutoId = data[0].auto_id;
            const numberPart = lastAutoId.split('-')[1];
            const lastNumber = parseInt(numberPart);
            
            // Check if parsing was successful
            if (!isNaN(lastNumber)) {
              const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
              const newId = `${prefix}-${nextNumber}`;
              console.log('Generated new auto ID:', newId);
              setAutoId(newId);
            } else {
              // If parsing failed, start with 00001
              console.log('Failed to parse last number, using default');
              const defaultId = `${prefix}-00001`;
              setAutoId(defaultId);
            }
          } else {
            console.log('No existing records found, using default ID');
            const defaultId = `${prefix}-00001`;
            setAutoId(defaultId);
          }
        } catch (err) {
          console.error('Error in getNextId:', err);
          const defaultId = `${prefix}-00001`;
          setAutoId(defaultId);
        } finally {
          setIsLoadingId(false);
        }
      };

      getNextId();
    }
  }, [isEditing, tableName, prefix]);

  return { autoId, isLoadingId };
}
