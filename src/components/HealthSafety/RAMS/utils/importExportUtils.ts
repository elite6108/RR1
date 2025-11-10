import { supabase } from '../../../../lib/supabase';
import type { RAMS } from '../../../../types/database';

export const handleExport = (
  selectedForExport: string | null,
  ramsEntries: RAMS[]
) => {
  if (!selectedForExport) return;
  
  const ramsToExport = ramsEntries.find(rams => rams.id === selectedForExport);
  if (!ramsToExport) return;

  // Fields to exclude from export (system-generated fields)
  const excludedFields = ['id', 'rams_number', 'created_at', 'updated_at', 'user_id'];
  
  // Create export data by including all fields except the excluded ones
  const exportData: any = {};
  
  Object.keys(ramsToExport).forEach(key => {
    if (!excludedFields.includes(key)) {
      exportData[key] = ramsToExport[key];
    }
  });

  // Create and download file
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `rams-${ramsToExport.reference.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const handleImport = async (
  event: React.ChangeEvent<HTMLInputElement>,
  fetchData: () => Promise<void>,
  setError: (error: string | null) => void
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const importData = JSON.parse(e.target?.result as string);
      
      // Validate required fields
      if (!importData.reference) {
        setError('Import file must contain a reference field');
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Unable to get user information. Please make sure you are logged in.');
        return;
      }

      // Generate new RAMS number
      const { data: existingRAMS } = await supabase
        .from('rams')
        .select('rams_number')
        .order('created_at', { ascending: false });

      let newRamsNumber = 1;
      if (existingRAMS && existingRAMS.length > 0) {
        const latestRamsId = existingRAMS[0].rams_number;
        if (latestRamsId) {
          const match = latestRamsId.match(/RAMS-(\d+)/);
          if (match) {
            newRamsNumber = parseInt(match[1]) + 1;
          }
        }
      }

      // Create new RAMS with imported data
      const newRAMS = {
        rams_number: `RAMS-${newRamsNumber.toString().padStart(3, '0')}`,
        user_id: user.id, // Add the current user's ID
        ...importData, // Spread all imported data
      };

      // Insert into database
      const { error: insertError } = await supabase
        .from('rams')
        .insert([newRAMS]);

      if (insertError) {
        console.error('Error importing RAMS:', insertError);
        setError(`Failed to import: ${insertError.message}`);
      } else {
        await fetchData(); // Refresh the list
        setError(null);
      }

    } catch (err) {
      console.error('Error parsing import file:', err);
      setError('Invalid file format. Please select a valid JSON file.');
    }
  };

  reader.readAsText(file);
  
  // Reset the input
  event.target.value = '';
};
