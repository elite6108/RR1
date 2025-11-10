import { supabase } from '../../../../lib/supabase';
import { PolicySection } from '../types';

export const addSection = (
  sections: PolicySection[],
  setSections: (sections: PolicySection[]) => void,
  setExpandedSections: (fn: (prev: Set<string>) => Set<string>) => void
) => {
  const newSectionId = crypto.randomUUID();
  const newSections = [...sections, {
    id: newSectionId,
    title: '',
    content: ''
  }];
  setSections(newSections);
  // Expand the new section by default
  setExpandedSections(prev => new Set([...prev, newSectionId]));
};

export const removeSection = (
  sectionId: string,
  sections: PolicySection[],
  setSections: (sections: PolicySection[]) => void,
  setExpandedSections: (fn: (prev: Set<string>) => Set<string>) => void
) => {
  const newSections = sections.filter(section => section.id !== sectionId);
  setSections(newSections);
  setExpandedSections(prev => {
    const newSet = new Set(prev);
    newSet.delete(sectionId);
    return newSet;
  });
};

export const toggleSection = (
  sectionId: string,
  setExpandedSections: (fn: (prev: Set<string>) => Set<string>) => void
) => {
  setExpandedSections(prev => {
    const newSet = new Set(prev);
    if (newSet.has(sectionId)) {
      newSet.delete(sectionId);
    } else {
      newSet.add(sectionId);
    }
    return newSet;
  });
};

export const updateSectionTitle = (
  sectionId: string,
  title: string,
  sections: PolicySection[],
  setSections: (sections: PolicySection[]) => void
) => {
  const newSections = sections.map(section =>
    section.id === sectionId ? { ...section, title } : section
  );
  setSections(newSections);
};

export const updateSectionContent = (
  sectionId: string,
  content: string,
  sections: PolicySection[],
  setSections: (sections: PolicySection[]) => void
) => {
  const newSections = sections.map(section =>
    section.id === sectionId ? { ...section, content } : section
  );
  setSections(newSections);
};

export const calculateNextPolicyNumber = async (): Promise<number> => {
  // Get count of actual displayable policies (same logic as OtherPolicies component)
  // This includes both uploaded files with metadata and created policies
  
  // First get storage files
  const { data: storageFiles, error: storageError } = await supabase
    .storage
    .from('other-policies')
    .list();

  // Get metadata for all files
  const { data: metadataData, error: metadataError } = await supabase
    .from('other_policy_files')
    .select('*')
    .order('created_at', { ascending: false });

  if (storageError || metadataError) {
    console.error('Error fetching policies:', storageError || metadataError);
    return 1;
  }

  console.log('DEBUG: Storage files:', storageFiles?.length || 0);
  console.log('DEBUG: Metadata records:', metadataData?.length || 0);
  console.log('DEBUG: Metadata data:', metadataData);

  let actualPolicyCount = 0;

  // Count uploaded files that have corresponding metadata
  if (storageFiles && metadataData) {
    const pdfFiles = storageFiles.filter((file: any) => file.name.toLowerCase().endsWith('.pdf'));
    const uploadedWithMetadata = pdfFiles.filter((file: any) => metadataData.find((m: any) => m.file_name === file.name));
    console.log('DEBUG: PDF files in storage:', pdfFiles.length);
    console.log('DEBUG: Uploaded files with metadata:', uploadedWithMetadata.length);
    actualPolicyCount += uploadedWithMetadata.length;
  }

  // Count created policies
  if (metadataData) {
    const createdPolicies = metadataData.filter((m: any) => m.type === 'created');
    console.log('DEBUG: Created policies:', createdPolicies.length);
    console.log('DEBUG: Created policies data:', createdPolicies);
    actualPolicyCount += createdPolicies.length;
  }

  console.log('DEBUG: Total actual policy count:', actualPolicyCount);

  // Calculate next policy number based on actual displayable policy count
  const nextPolicyNumber = actualPolicyCount + 1;
  console.log('DEBUG: Next policy number will be:', nextPolicyNumber);

  return nextPolicyNumber;
};
