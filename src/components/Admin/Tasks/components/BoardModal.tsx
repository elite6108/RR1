import React from 'react';
import { Board } from '../types';
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormFooter,
  FormField,
  TextInput,
  TextArea
} from '../../../../utils/form';

interface BoardModalProps {
  showBoardModal: boolean;
  editingBoard: Board | null;
  boardFormData: {
    name: string;
    description: string;
    border_color: string;
  };
  setBoardFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    border_color: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const BoardModal = ({
  showBoardModal,
  editingBoard,
  boardFormData,
  setBoardFormData,
  onSubmit,
  onClose,
}) => {
  if (!showBoardModal) return null;

  return (
    <FormContainer isOpen={showBoardModal} maxWidth="md">
      <FormHeader
        title={editingBoard ? 'Edit Board' : 'Add Board'}
        onClose={onClose}
      />
      
      <FormContent>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <FormField label="Name" required>
              <TextInput
                value={boardFormData.name}
                onChange={(e) =>
                  setBoardFormData({
                    ...boardFormData,
                    name: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Description">
              <TextArea
                value={boardFormData.description}
                onChange={(e) =>
                  setBoardFormData({
                    ...boardFormData,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </FormField>

            <FormField label="Border Color">
              <input
                type="color"
                value={boardFormData.border_color}
                onChange={(e) =>
                  setBoardFormData({
                    ...boardFormData,
                    border_color: e.target.value,
                  })
                }
                className="mt-1 block w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
              />
            </FormField>
          </div>
        </form>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onSubmit={() => onSubmit({ preventDefault: () => {} } as React.FormEvent)}
        isLastStep={true}
        submitButtonText={editingBoard ? 'Save Changes' : 'Create Board'}
        showPrevious={false}
      />
    </FormContainer>
  );
};
