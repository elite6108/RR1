import { supabase } from '../../../../lib/supabase';
import type { RiskAssessment } from '../../../../types/database';

export const handleExport = (
  selectedForExport: string | null,
  riskAssessments: RiskAssessment[]
) => {
  if (!selectedForExport) return;
  
  const assessmentToExport = riskAssessments.find(ra => ra.id === selectedForExport);
  if (!assessmentToExport) return;

  // Fields to exclude from export (system-generated fields)
  const excludedFields = ['id', 'ra_id', 'created_at', 'updated_at', 'user_id'];
  
  // Create export data by including all fields except the excluded ones
  const exportData: any = {};
  
  Object.keys(assessmentToExport).forEach(key => {
    if (!excludedFields.includes(key)) {
      exportData[key] = assessmentToExport[key];
    }
  });

  // Create and download file
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `risk-assessment-${assessmentToExport.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
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
      if (!importData.name) {
        setError('Import file must contain a name field');
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Unable to get user information. Please make sure you are logged in.');
        return;
      }

      // Generate new RA number
      const { data: existingRAs } = await supabase
        .from('risk_assessments')
        .select('ra_id')
        .order('created_at', { ascending: false });

      let newRaNumber = 1;
      if (existingRAs && existingRAs.length > 0) {
        const latestRaId = existingRAs[0].ra_id;
        if (latestRaId) {
          const match = latestRaId.match(/RA-(\d+)/);
          if (match) {
            newRaNumber = parseInt(match[1]) + 1;
          }
        }
      }

      // Create new risk assessment with imported data
      const newAssessment = {
        ra_id: `RA-${newRaNumber.toString().padStart(3, '0')}`,
        user_id: user.id, // Add the current user's ID
        ...importData, // Spread all imported data
      };

      // Insert into database
      const { error: insertError } = await supabase
        .from('risk_assessments')
        .insert([newAssessment]);

      if (insertError) {
        console.error('Error importing risk assessment:', insertError);
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
