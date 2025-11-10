import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { RiskAssessment } from '../../../types/database';
import { 
  FormContainer, 
  FormHeader, 
  FormContent, 
  FormFooter, 
  StepIndicator 
} from '../../../utils/form';

// Import screen components
import { DetailsScreen } from './components/form-steps/DetailsScreen';
import { PPEScreen } from './components/form-steps/PPEScreen';
import { GuidelinesScreen } from './components/form-steps/GuidelinesScreen';
import { WorkingMethodScreen } from './components/form-steps/WorkingMethodScreen';
import { HazardsScreen } from './components/form-steps/HazardsScreen';

// Import hooks
import { validateCurrentScreen } from './hooks/useFormValidation';
import { submitForm } from './hooks/useFormSubmission';

interface RiskAssessmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  assessmentToEdit?: RiskAssessment | null;
}

interface WorkingMethodItem {
  id: string;
  number: number;
  description: string;
}

interface HazardItem {
  id: string;
  title: string;
  whoMightBeHarmed: string;
  howMightBeHarmed: string;
  beforeLikelihood: number;
  beforeSeverity: number;
  beforeTotal: number;
  controlMeasures: { id: string; description: string }[];
  afterLikelihood: number;
  afterSeverity: number;
  afterTotal: number;
}

type Screen = 'details' | 'ppe' | 'guidelines' | 'workingMethod' | 'hazards';

export function RiskAssessmentForm({ onClose, onSuccess, assessmentToEdit }: RiskAssessmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('details');
  const [formData, setFormData] = useState({
    name: assessmentToEdit?.name || '',
    location: assessmentToEdit?.location || '',
    assessor: assessmentToEdit?.assessor || '',
    selectedPPE: assessmentToEdit?.ppe || [],
    guidelines: assessmentToEdit?.guidelines || '',
    workingMethods: assessmentToEdit?.working_methods || [],
    hazards: assessmentToEdit?.hazards || []
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch user's display name
  useEffect(() => {
    const fetchUserDisplayName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.display_name && !assessmentToEdit) {
          setFormData(prev => ({ ...prev, assessor: user.user_metadata.display_name }));
        }
      } catch (err) {
        console.error('Error fetching user display name:', err);
      }
    };

    fetchUserDisplayName();
  }, [assessmentToEdit]);

  const handleChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };



  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Only proceed with submission if we're on the hazards screen
    if (currentScreen !== 'hazards') {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await submitForm(formData, assessmentToEdit, onSuccess, onClose);
    } catch (err) {
      console.error('Error saving risk assessment:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(err.message as string);
      } else {
        setError('An unexpected error occurred while saving the risk assessment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextScreen = () => {
    const validationError = validateCurrentScreen(currentScreen, formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    switch (currentScreen) {
      case 'details':
        setCurrentScreen('ppe');
        break;
      case 'ppe':
        setCurrentScreen('guidelines');
        break;
      case 'guidelines':
        setCurrentScreen('workingMethod');
        break;
      case 'workingMethod':
        setCurrentScreen('hazards');
        break;
    }
  };

  const previousScreen = () => {
    setError(null);
    switch (currentScreen) {
      case 'ppe':
        setCurrentScreen('details');
        break;
      case 'guidelines':
        setCurrentScreen('ppe');
        break;
      case 'workingMethod':
        setCurrentScreen('guidelines');
        break;
      case 'hazards':
        setCurrentScreen('workingMethod');
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'details':
        return <DetailsScreen data={formData} onChange={handleChange} />;
      case 'ppe':
        return <PPEScreen data={formData} onChange={handleChange} />;
      case 'guidelines':
        return <GuidelinesScreen data={formData} onChange={handleChange} />;
      case 'workingMethod':
        return <WorkingMethodScreen data={formData} onChange={handleChange} />;
      case 'hazards':
        return <HazardsScreen data={formData} onChange={handleChange} />;
    }
  };

  const stepLabels = ['Details', 'PPE', 'Guidelines', 'Working Method', 'Hazards'];
  
  const getCurrentStepNumber = () => {
    switch (currentScreen) {
      case 'details':
        return 1;
      case 'ppe':
        return 2;
      case 'guidelines':
        return 3;
      case 'workingMethod':
        return 4;
      case 'hazards':
        return 5;
    }
  };

  return (
    <FormContainer isOpen={true} maxWidth="4xl">
      <FormHeader
        title={assessmentToEdit ? 'Edit Risk Assessment' : 'New Risk Assessment'}
        onClose={onClose}
      />
      
      <FormContent>
        <StepIndicator
          currentStep={getCurrentStepNumber()}
          totalSteps={5}
          stepLabels={stepLabels}
        />
        
        <div className="space-y-6">
          {renderScreen()}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                {error.split('\n').map((line, index) => (
                  <p key={index} className="mb-1 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </FormContent>
      
      <FormFooter
        onCancel={onClose}
        onPrevious={currentScreen !== 'details' ? previousScreen : undefined}
        onNext={currentScreen !== 'hazards' ? nextScreen : undefined}
        onSubmit={currentScreen === 'hazards' ? handleSubmit : undefined}
        isFirstStep={currentScreen === 'details'}
        isLastStep={currentScreen === 'hazards'}
        submitButtonText={loading ? 'Saving...' : (assessmentToEdit ? 'Update Assessment' : 'Save Assessment')}
        loading={loading}
        disabled={loading}
      />
    </FormContainer>
  );
}