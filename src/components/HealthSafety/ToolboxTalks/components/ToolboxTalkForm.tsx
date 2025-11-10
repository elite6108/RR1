import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Edit } from 'lucide-react';
import { SignatureCanvas } from '../SignatureCanvas';
import { PDFViewerModal, PDFUpdateModal } from './PDFModals';
import { useToolboxTalkForm } from '../hooks/useToolboxTalkForm';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter, 
  FormField, 
  TextInput, 
  Select 
} from '../../../../utils/form';

interface ToolboxTalkFormProps {
  talk: {
    id: string;
    title: string;
  };
  onClose: () => void;
  onNavigateToCompletedTalks: () => void;
}



export function ToolboxTalkForm({ talk, onClose, onNavigateToCompletedTalks }: ToolboxTalkFormProps) {
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentAttendeeId, setCurrentAttendeeId] = useState<string | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showPDFUpdateModal, setShowPDFUpdateModal] = useState(false);

  const {
    loading,
    error,
    projects,
    sites,
    pdfFiles,
    allPDFs,
    selectedNewPDF,
    setSelectedNewPDF,
    formData,
    setFormData,
    handleSubmit,
    handlePDFUpdate,
    fetchAllPDFs
  } = useToolboxTalkForm({ talk, onClose, onNavigateToCompletedTalks });

  // Update useEffect to fetch all PDFs when modal opens
  useEffect(() => {
    if (showPDFUpdateModal) {
      fetchAllPDFs();
    }
  }, [showPDFUpdateModal, fetchAllPDFs]);

  const handleAddAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [
        ...prev.attendees,
        {
          id: crypto.randomUUID(),
          name: '',
          signature: null
        }
      ]
    }));
  };

  const handleRemoveAttendee = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a.id !== id)
    }));
  };

  const handleAttendeeNameChange = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.map(a => 
        a.id === id ? { ...a, name } : a
      )
    }));
  };

  const handleSignatureComplete = (signature: string) => {
    if (currentAttendeeId) {
      setFormData(prev => ({
        ...prev,
        attendees: prev.attendees.map(a => 
          a.id === currentAttendeeId ? { ...a, signature } : a
        )
      }));
    }
    setShowSignatureModal(false);
    setCurrentAttendeeId(null);
  };

  const handleSignatureCancel = () => {
    setShowSignatureModal(false);
    setCurrentAttendeeId(null);
  };

  const handleFormSubmit = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const selectedPDFFile = pdfFiles.find(file => file.name === formData.selectedPDF);

  return (
    <>
      <FormContainer isOpen={true} maxWidth="2xl">
        <FormHeader 
          title="New Toolbox Talk" 
          subtitle={talk.id}
          onClose={onClose} 
        />

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <FormContent>
            <div className="space-y-6">
              <FormField label="Toolbox Talk" required>
                <TextInput
                  value={formData.title}
                  onChange={() => {}} // Disabled field
                  disabled
                />
              </FormField>

              <FormField label="Project">
                <Select
                  id="project"
                  value={formData.projectId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, projectId: e.target.value, siteReference: '' }))}
                  options={projects.map(project => ({ value: project.id, label: project.name }))}
                  placeholder="Select a project (optional)"
                />
              </FormField>
            
              <FormField label="Site Reference">
                <Select
                  id="siteReference"
                  value={formData.siteReference}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, siteReference: e.target.value }))}
                  options={sites.map(site => ({ value: site.name, label: site.name }))}
                  placeholder={!formData.projectId ? 'Select a project first (optional)' : 'Select a site (optional)'}
                  disabled={!formData.projectId}
                />
              </FormField>

              <FormField label="Presenter" required>
                <TextInput
                  id="presenter"
                  value={formData.presenter}
                  onChange={() => {}} // Disabled field
                  disabled
                  placeholder="Loading presenter name..."
                />
              </FormField>

              <FormField label="PDF Document" required>
                <div className="flex flex-col sm:flex-row gap-2">
                  <TextInput
                    value={selectedPDFFile?.displayName || ''}
                    onChange={() => {}} // Disabled field
                    disabled
                    className="flex-1"
                  />
                  {selectedPDFFile && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowPDFModal(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPDFUpdateModal(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update PDF
                      </button>
                    </>
                  )}
                </div>
              </FormField>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendees *</h3>
                  <button
                    type="button"
                    onClick={handleAddAttendee}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Attendee
                  </button>
                </div>

                <div className="max-h-[300px] overflow-y-auto pr-2">
                  <div className="space-y-4">
                    {formData.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-2 sm:space-y-0 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex-1">
                          <TextInput
                            value={attendee.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAttendeeNameChange(attendee.id, e.target.value)}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="flex space-x-2 sm:flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentAttendeeId(attendee.id);
                              setShowSignatureModal(true);
                            }}
                            className={`flex-1 sm:flex-none px-3 py-2 text-sm font-medium rounded-md ${
                              attendee.signature
                                ? 'text-green-700 bg-green-100 hover:bg-green-200'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {attendee.signature ? 'Signed' : 'Sign'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttendee(attendee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {formData.attendees.length === 0 && (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        Click "Add Attendee" to add people to the talk
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                  <div className="h-5 w-5 flex-shrink-0 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </FormContent>
          
          <FormFooter
            onCancel={onClose}
            onSubmit={handleFormSubmit}
            isLastStep={true}
            submitButtonText={loading ? 'Saving...' : 'Start Talk'}
            disabled={loading}
            loading={loading}
          />
        </form>
      </FormContainer>

      {showSignatureModal && (
        <SignatureCanvas
          onComplete={handleSignatureComplete}
          onCancel={handleSignatureCancel}
        />
      )}

      <PDFViewerModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        pdfFile={selectedPDFFile!}
      />

      <PDFUpdateModal
        isOpen={showPDFUpdateModal}
        onClose={() => setShowPDFUpdateModal(false)}
        allPDFs={allPDFs}
        selectedNewPDF={selectedNewPDF}
        setSelectedNewPDF={setSelectedNewPDF}
        onUpdate={handlePDFUpdate}
        loading={loading}
      />
    </>
  );
}
