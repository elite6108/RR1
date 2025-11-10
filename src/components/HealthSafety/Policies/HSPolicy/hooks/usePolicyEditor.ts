import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import ReactQuill from 'react-quill';
import type { PolicySection, PolicyContent } from '../../../types/policy';

export const usePolicyEditor = (existingPolicy?: any) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [policyContent, setPolicyContent] = useState<PolicyContent>({ 
    sections: [],
    sectionOrder: []
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [policyToEdit, setPolicyToEdit] = useState<any>(null);
  const [editableSections, setEditableSections] = useState<Set<string>>(new Set());
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const editorsRef = useRef<{ [key: string]: ReactQuill | null }>({});
  const [forceUpdateKey, setForceUpdateKey] = useState(Date.now());

  const registerEditor = useCallback((sectionId: string, editor: ReactQuill | null) => {
    editorsRef.current[sectionId] = editor;
  }, []);

  const getEditorContent = (sectionId: string): string => {
    const editor = editorsRef.current[sectionId];
    if (editor) {
      return editor.getEditor().root.innerHTML;
    }
    return '';
  };

  const getAllSectionTitles = () => {
    // Import these from the appropriate location in your codebase
    const GENERAL_POLICY_STATEMENT_SECTIONS = { sections: [] };
    const ORGANISATION_SECTIONS = { sections: [] };
    const GENERAL_POLICIES_SECTIONS = { sections: [] };
    const OFFICE_ARRANGEMENTS_SECTIONS = { sections: [] };
    const GENERAL_WORK_SECTIONS = { sections: [] };
    const ASBESTOS_SECTIONS = { sections: [] };
    const HEALTH_SAFETY_SECTIONS = { sections: [] };
    const HEIGHT_WORK_SECTIONS = { sections: [] };

    return [
      ...GENERAL_POLICY_STATEMENT_SECTIONS.sections,
      ...ORGANISATION_SECTIONS.sections,
      ...GENERAL_POLICIES_SECTIONS.sections,
      ...OFFICE_ARRANGEMENTS_SECTIONS.sections,
      ...GENERAL_WORK_SECTIONS.sections,
      ...ASBESTOS_SECTIONS.sections,
      ...HEALTH_SAFETY_SECTIONS.sections,
      ...HEIGHT_WORK_SECTIONS.sections
    ];
  };

  const fetchPolicyContent = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the policy ID from the URL if it exists
      const urlParams = new URLSearchParams(window.location.search);
      const policyId = urlParams.get('id');

      if (policyId) {
        const { data: policy, error } = await supabase
          .from('hs_policy_files')
          .select('*, policy_number')
          .eq('id', policyId)
          .single();

        if (error) throw error;
        if (policy) {
          setPolicyToEdit(policy);
          const content = JSON.parse(policy.content);
          setPolicyContent({
            ...content,
            sectionOrder: content.sections.map((s: any) => s.title)
          });
        }
      }
    } catch (err) {
      console.error('Error fetching policy content:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching policy content');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setPolicyContent(prev => {
      return {
        sections: prev.sections.filter(s => s.id !== sectionId),
      };
    });
  };

  const handleSectionSelect = (section: string) => {
    console.log("EDITOR - Section selected:", section);
    setSelectedSection(section);
    
    const existingSection = policyContent.sections.find(s => s.title === section);
    
    if (!existingSection) {
      console.log("EDITOR - Creating new section:", section);
      // Get all section titles from the left menu
      const allSections = getAllSectionTitles();

      // Find the index of the current section in the full list
      const sectionIndex = allSections.indexOf(section);

      // Get template content and log it for debugging
      const POLICY_TEMPLATES: { [key: string]: string } = {};
      const templateContent = POLICY_TEMPLATES[section] || '';
      console.log(`EDITOR - Template for "${section}": `, templateContent ? 
        `Found (${templateContent.length} chars): ${templateContent.substring(0, 100)}...` : 
        'Not found or empty');

      const newSection = {
        id: crypto.randomUUID(),
        title: section,
        content: templateContent,
        order: sectionIndex
      };

      console.log("EDITOR - Adding new section to content:", newSection.title, 
                 "with content length:", newSection.content.length);
      setPolicyContent(prev => ({
        ...prev,
        sections: [...prev.sections, newSection],
        sectionOrder: allSections
      }));
      // Make new section editable by default
      setEditableSections(prev => new Set([...prev, newSection.id]));
    }
  };

  const handleContentChange = (content: string, sectionId?: string) => {
    // If sectionId is provided directly (from editor), use it
    if (sectionId) {
      console.log(`EDITOR - Content changed for section ID: ${sectionId} (direct)`);
      
      setPolicyContent(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? { ...section, content }
            : section
        )
      }));
      return;
    }
    
    // Otherwise use selectedSection title
    if (!selectedSection) return;

    const sectionIndex = policyContent.sections.findIndex(s => s.title === selectedSection);
    if (sectionIndex === -1) return;

    console.log(`EDITOR - Content changed for section: ${selectedSection}`);
    
    setPolicyContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.title === selectedSection
          ? { ...section, content }
          : section
      )
    }));
  };

  const makeEditable = (sectionId: string) => {
    setEditableSections(prev => new Set([...prev, sectionId]));
  };

  return {
    selectedSection,
    setSelectedSection,
    policyContent,
    setPolicyContent,
    error,
    setError,
    loading,
    setLoading,
    policyToEdit,
    setPolicyToEdit,
    editableSections,
    setEditableSections,
    savingSection,
    setSavingSection,
    savingAll,
    setSavingAll,
    editorsRef,
    forceUpdateKey,
    setForceUpdateKey,
    registerEditor,
    getEditorContent,
    getAllSectionTitles,
    fetchPolicyContent,
    handleDeleteSection,
    handleSectionSelect,
    handleContentChange,
    makeEditable
  };
};
