import React from 'react';
import type { TrainingFormProps } from '../types';
import { useTrainingForm } from '../hooks/useTrainingForm';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter,
  StepIndicator 
} from '../../../../utils/form';
import { 
  Step1StaffSelection, 
  Step2TrainingRecords, 
  Step3CardsTickets, 
  Step4Certificates 
} from '../components/form-steps';
import { STEP_LABELS, TOTAL_STEPS, FORM_STEPS } from '../utils/constants';

export function TrainingForm({ onClose, editData }: TrainingFormProps) {
  const {
    // State
    currentStep,
    combinedStaffUsers,
    selectedStaff,
    trainingRecords,
    cardTickets,
    expandedTrainingItems,
    expandedCards,
    filePreviews,

    // Actions
    setCurrentStep,
    setSelectedStaff,
    setTrainingRecords,
    setCardTickets,
    setExpandedTrainingItems,
    setExpandedCards,
    setFilePreviews,
    handleSubmit
  } = useTrainingForm({ onClose, editData });

  return (
    <FormContainer isOpen={true} maxWidth="4xl">
      <FormHeader 
        title={editData ? 'Edit Training Matrix' : 'New Training Matrix'}
        onClose={onClose}
      />
      <FormContent>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />

        <form className="flex flex-col flex-1">
          <div className="space-y-6">
            {currentStep === FORM_STEPS.STAFF_SELECTION && (
              <Step1StaffSelection
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
                combinedStaffUsers={combinedStaffUsers}
                editData={editData}
              />
            )}

            {currentStep === FORM_STEPS.TRAINING_RECORDS && (
              <Step2TrainingRecords
                trainingRecords={trainingRecords}
                setTrainingRecords={setTrainingRecords}
                expandedTrainingItems={expandedTrainingItems}
                setExpandedTrainingItems={setExpandedTrainingItems}
              />
            )}

            {currentStep === FORM_STEPS.CARDS_TICKETS && (
              <Step3CardsTickets
                cardTickets={cardTickets}
                setCardTickets={setCardTickets}
                expandedCards={expandedCards}
                setExpandedCards={setExpandedCards}
              />
            )}

            {currentStep === FORM_STEPS.CERTIFICATES && (
              <Step4Certificates
                filePreviews={filePreviews}
                setFilePreviews={setFilePreviews}
              />
            )}
          </div>
        </form>
      </FormContent>
      <FormFooter
        onCancel={onClose}
        onPrevious={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
        onNext={currentStep < TOTAL_STEPS ? () => setCurrentStep(currentStep + 1) : undefined}
        onSubmit={currentStep === TOTAL_STEPS ? handleSubmit : undefined}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === TOTAL_STEPS}
        submitButtonText="Complete & Save"
        showPrevious={true}
      />
    </FormContainer>
  );
}