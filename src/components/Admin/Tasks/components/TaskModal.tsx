import React from 'react';
import { Task, Board, Project, CombinedStaffUser, TaskFormData, Message } from '../types';
import { TaskInfoTab } from './TaskInfoTab';
import { TaskNotesTab } from './TaskNotesTab';
import { TaskAttachmentsTab } from './TaskAttachmentsTab';
import { TaskChatTab } from './TaskChatTab';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  StepIndicator
} from '../../../../utils/form';

interface TaskModalProps {
  showTaskModal: boolean;
  editingTask: Task | null;
  taskFormData: TaskFormData;
  setTaskFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  boards: Board[];
  projects: Project[];
  combinedStaffUsers: CombinedStaffUser[];
  messages: Message[];
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  activeTab: 'info' | 'notes' | 'attachments' | 'chat';
  setActiveTab: React.Dispatch<React.SetStateAction<'info' | 'notes' | 'attachments' | 'chat'>>;
  user: any;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onSendMessage: () => void;
  onRemoveFile: (index: number) => void;
  onRemoveExistingAttachment: (index: number) => void;
}

export const TaskModal = ({
  showTaskModal,
  editingTask,
  taskFormData,
  setTaskFormData,
  boards,
  projects,
  combinedStaffUsers,
  messages,
  newMessage,
  setNewMessage,
  activeTab,
  setActiveTab,
  user,
  onSubmit,
  onClose,
  onSendMessage,
  onRemoveFile,
  onRemoveExistingAttachment,
}) => {
  if (!showTaskModal) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only submit if explicitly triggered by submit button click, never on tab changes
  };

  const stepLabels = ['Details', 'Notes', 'Attachments', 'Chat'];
  const getCurrentStep = () => {
    switch (activeTab) {
      case 'info': return 1;
      case 'notes': return 2;
      case 'attachments': return 3;
      case 'chat': return 4;
      default: return 1;
    }
  };

  const handlePrevious = () => {
    if (activeTab === 'notes') setActiveTab('info');
    if (activeTab === 'attachments') setActiveTab('notes');
    if (activeTab === 'chat') setActiveTab('attachments');
  };

  const handleNext = () => {
    if (activeTab === 'info') setActiveTab('notes');
    if (activeTab === 'notes') setActiveTab('attachments');
    if (activeTab === 'attachments') setActiveTab('chat');
  };

  return (
    <FormContainer isOpen={showTaskModal} maxWidth="4xl">
      <FormHeader
        title={editingTask ? 'Edit Task' : 'Add Task'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={getCurrentStep()}
          totalSteps={4}
          stepLabels={stepLabels}
        />
        
        <form onSubmit={handleFormSubmit}>
          {/* Tab Content */}
          <div className="max-h-[60vh] sm:max-h-[500px] overflow-y-auto pr-4">
              {activeTab === 'info' && (
                <TaskInfoTab
                  taskFormData={taskFormData}
                  setTaskFormData={setTaskFormData}
                  boards={boards}
                  projects={projects}
                  combinedStaffUsers={combinedStaffUsers}
                />
              )}

              {activeTab === 'notes' && (
                <TaskNotesTab
                  taskFormData={taskFormData}
                  setTaskFormData={setTaskFormData}
                />
              )}

              {activeTab === 'attachments' && (
                <TaskAttachmentsTab
                  taskFormData={taskFormData}
                  setTaskFormData={setTaskFormData}
                  onRemoveFile={onRemoveFile}
                  onRemoveExistingAttachment={onRemoveExistingAttachment}
                />
              )}

              {activeTab === 'chat' && (
                editingTask ? (
                  <TaskChatTab
                    messages={messages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    user={user}
                    onSendMessage={onSendMessage}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Chat will be available after creating the task
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You can add messages and communicate with team members once the task is saved.
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onPrevious={activeTab !== 'info' ? handlePrevious : undefined}
        onNext={activeTab !== 'chat' ? handleNext : undefined}
        onSubmit={activeTab === 'chat' ? () => onSubmit({ preventDefault: () => {} } as React.FormEvent) : undefined}
        isFirstStep={activeTab === 'info'}
        isLastStep={activeTab === 'chat'}
        nextButtonText="Next"
        submitButtonText={editingTask ? 'Save Changes' : 'Create Task'}
        showPrevious={true}
      />
    </FormContainer>
  );
};
