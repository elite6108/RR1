import React, { useState, useRef, useEffect } from 'react';
import { X, Save, AlertCircle, Loader2, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../../lib/supabase';
import jsPDF from 'jspdf';

interface PolicySection {
  id: string;
  title: string;
  content: string;
}

interface CreatePolicyModalProps {
  onClose: () => void;
  onSuccess: () => void;
  policyToEdit?: {
    id: string;
    name: string;
    content: string;
  } | null;
}

export function CreatePolicyModal({ onClose, onSuccess, policyToEdit }: CreatePolicyModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: policyToEdit?.name || '',
    sections: [] as PolicySection[]
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const quillRefs = useRef<{ [key: string]: ReactQuill | null }>({});

  useEffect(() => {
    if (policyToEdit) {
      // Parse existing content to sections
      try {
        const parsedContent = JSON.parse(policyToEdit.content);
        if (Array.isArray(parsedContent)) {
          const sections = parsedContent;
          setFormData({
            name: policyToEdit.name,
            sections: sections
          });
          // Expand all sections by default when editing
          setExpandedSections(new Set(sections.map(s => s.id)));
        } else {
          // Legacy format - convert single content to a section
          const sectionId = crypto.randomUUID();
          setFormData({
            name: policyToEdit.name,
            sections: [{
              id: sectionId,
              title: 'Content',
              content: policyToEdit.content
            }]
          });
          setExpandedSections(new Set([sectionId]));
        }
      } catch {
        // If parsing fails, treat as legacy single content
        const sectionId = crypto.randomUUID();
        setFormData({
          name: policyToEdit.name,
          sections: [{
            id: sectionId,
            title: 'Content',
            content: policyToEdit.content
          }]
        });
        setExpandedSections(new Set([sectionId]));
      }
    } else {
      // Start with one empty section for new policies
      const sectionId = crypto.randomUUID();
      setFormData({
        name: '',
        sections: [{
          id: sectionId,
          title: '',
          content: ''
        }]
      });
      setExpandedSections(new Set([sectionId]));
    }
  }, [policyToEdit]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'color', 'background',
    'font',
    'align',
    'link'
  ];

  const addSection = () => {
    const newSectionId = crypto.randomUUID();
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, {
        id: newSectionId,
        title: '',
        content: ''
      }]
    }));
    // Expand the new section by default
    setExpandedSections(prev => new Set([...prev, newSectionId]));
  };

  const removeSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
  };

  const toggleSection = (sectionId: string) => {
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

  const updateSectionTitle = (sectionId: string, title: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, title } : section
      )
    }));
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, content } : section
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('DEBUG: Starting form submission');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('DEBUG: User authenticated');

      if (!formData.name.trim()) {
        throw new Error('Policy name is required');
      }
      if (formData.sections.length === 0) {
        throw new Error('At least one section is required');
      }
      if (formData.sections.some(section => !section.title.trim() || !section.content.trim())) {
        throw new Error('All sections must have both title and content');
      }

      console.log('DEBUG: Form validation passed');

      // Serialize sections as JSON
      const contentData = JSON.stringify(formData.sections);

      let error;
      if (policyToEdit) {
        console.log('DEBUG: Editing existing policy');
        // Update existing policy
        ({ error } = await supabase
          .from('other_policy_files')
          .update({
            display_name: formData.name,
            content: contentData,
            type: 'created'
          })
          .eq('id', policyToEdit.id));
      } else {
        console.log('DEBUG: Creating new policy');
        // Generate filename for new policy - use clean policy name
        const fileName = `${formData.name.trim()}.pdf`;
        console.log('DEBUG: Generated filename:', fileName);

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

        // Create new policy
        ({ error } = await supabase
          .from('other_policy_files')
          .insert({
            file_name: fileName,
            display_name: formData.name,
            content: contentData,
            type: 'created',
            user_id: user.id,
            policy_number: nextPolicyNumber
          }));
      }

      if (error) {
        throw error;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving policy:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-[100]"></div>
      <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-[100] p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{policyToEdit ? 'Edit Policy' : 'Create New Policy'}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6 pr-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Policy Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter policy name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Policy Sections*
                </label>

                <div className="space-y-4">
                  {formData.sections.map((section, index) => {
                    const isExpanded = expandedSections.has(section.id);
                    return (
                      <div key={section.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/20">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => toggleSection(section.id)}
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5" />
                              ) : (
                                <ChevronRight className="h-5 w-5" />
                              )}
                            </button>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              Section {index + 1}
                              {section.title && `: ${section.title}`}
                            </h3>
                          </div>
                          {formData.sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSection(section.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Section Title*
                              </label>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSectionTitle(section.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter section title"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Section Content*
                              </label>
                              <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                                <ReactQuill
                                  ref={(el: ReactQuill | null) => { quillRefs.current[section.id] = el; }}
                                  theme="snow"
                                  value={section.content}
                                  onChange={(content: string) => updateSectionContent(section.id, content)}
                                  modules={modules}
                                  formats={formats}
                                  className="dark:text-white h-32 lg:h-[21rem]"
                                  preserveWhitespace
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={addSection}
                  className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Section
                </button>
              </div>

              {/* Add custom dark mode styles for Quill */}
              <style jsx global>{`
                .dark .ql-toolbar {
                  background-color: rgb(31, 41, 55) !important;
                  border-color: rgb(75, 85, 99) !important;
                }
                
                .dark .ql-container {
                  background-color: rgb(17, 24, 39) !important;
                  border-color: rgb(75, 85, 99) !important;
                  color: white !important;
                }

                .dark .ql-stroke {
                  stroke: rgb(209, 213, 219) !important;
                }

                .dark .ql-fill {
                  fill: rgb(209, 213, 219) !important;
                }

                .dark .ql-picker {
                  color: rgb(209, 213, 219) !important;
                }

                .dark .ql-picker-options {
                  background-color: rgb(31, 41, 55) !important;
                  border-color: rgb(75, 85, 99) !important;
                }

                .dark .ql-picker.ql-expanded .ql-picker-label {
                  border-color: rgb(75, 85, 99) !important;
                }

                .dark .ql-picker.ql-expanded .ql-picker-options {
                  border-color: rgb(75, 85, 99) !important;
                }

                .dark .ql-toolbar button:hover .ql-stroke,
                .dark .ql-toolbar button.ql-active .ql-stroke {
                  stroke: rgb(99, 102, 241) !important;
                }

                .dark .ql-toolbar button:hover .ql-fill,
                .dark .ql-toolbar button.ql-active .ql-fill {
                  fill: rgb(99, 102, 241) !important;
                }

                .dark .ql-toolbar .ql-picker-label:hover,
                .dark .ql-toolbar .ql-picker-item:hover,
                .dark .ql-toolbar .ql-picker-item.ql-selected {
                  color: rgb(99, 102, 241) !important;
                }
              `}</style>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {policyToEdit ? 'Update Policy' : 'Save Policy'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}