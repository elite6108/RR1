import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import type { CPP } from '../../../../../types/database';
import { Step1FrontCover } from './Step1FrontCover';
import { Step2SiteInformation } from './Step2SiteInformation';
import { Step3ProjectDescription } from './Step3ProjectDescription';
import { Step4HoursTeam } from './Step4HoursTeam';
import { Step5ManagementWork } from './Step5ManagementWork';
import { Step6ManagementStructure } from './Step6ManagementStructure';
import { Step7SiteRules } from './Step7SiteRules';
import { Step8Arrangements } from './Step8Arrangements';
import { Step9SiteInduction } from './Step9SiteInduction';
import { Step10WelfareArrangements } from './Step10WelfareArrangements';
import { Step11FirstAidArrangements } from './Step11FirstAidArrangements';
import { Step12RescuePlan } from './Step12RescuePlan';
import { Step13SpecificMeasures } from './Step13SpecificMeasures';
import { Step14Hazards } from './Step14Hazards';
import { Step15HighRiskConstructionWork } from './Step15HighRiskConstructionWork';
import { Step16NotifiableWork } from './Step16NotifiableWork';
import { Step17Contractors } from './Step17Contractors';
import { Step18Mon } from './Step18Mon';
import { Step19HSFile } from './Step19HSFile';
import { Step20HIdentification } from './Step20HIdentification';
import type { CPPFormData } from '../../../../../types/cpp';

interface CPPFormProps {
  onClose: () => void;
  onSuccess: () => void;
  cppToEdit?: CPP | null;
}

export function CPPForm({ onClose, onSuccess, cppToEdit }: CPPFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 19;
  const [saving, setSaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Scroll to modal when it opens
  useEffect(() => {
    if (modalRef.current) {
      const elementTop = modalRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - 30,
        behavior: 'smooth'
      });
    }
  }, []);

  // Load existing data when editing
  useEffect(() => {
    const loadExistingData = async () => {
      if (!cppToEdit) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cpps')
          .select('*')
          .eq('id', cppToEdit.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('CPP not found');

        // Transform snake_case database fields back to camelCase for the form
        setFormData({
          frontCover: data.front_cover || formData.frontCover,
          projectDescription:
            data.project_description || formData.projectDescription,
          siteInformation: data.site_information || formData.siteInformation,
          hoursTeam: data.hours_team || formData.hoursTeam,
          managementWork: data.management_work || formData.managementWork,
          managementStructure:
            data.management_structure || formData.managementStructure,
          siteRules: data.site_rules || formData.siteRules,
          arrangements: data.arrangements || formData.arrangements,
          siteInduction: data.site_induction || formData.siteInduction,
          welfareArrangements:
            data.welfare_arrangements || formData.welfareArrangements,
          firstAidArrangements:
            data.first_aid_arrangements || formData.firstAidArrangements,
          rescuePlan: data.rescue_plan || formData.rescuePlan,
          specificMeasures: data.specific_measures || formData.specificMeasures,
          hazards: data.hazards || formData.hazards,
          highRiskWork: data.high_risk_work || formData.highRiskWork,
          notifiableWork: data.notifiable_work || formData.notifiableWork,
          contractors: data.contractors || formData.contractors,
          monitoring: data.monitoring || formData.monitoring,
          hsFile: data.hs_file || formData.hsFile,
          hazardIdentification:
            data.hazard_identification || formData.hazardIdentification,
        });
      } catch (err) {
        console.error('Error loading CPP data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load CPP data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadExistingData();
  }, [cppToEdit]);

  const [formData, setFormData] = useState<CPPFormData>({
    frontCover: {
      projectName: '',
      projectId: '',
      projectReference: '',
      projectLocation: '',
      clientName: '',
      principalContractor: '',
      contractorName: '',
      preparedBy: '',
      preparedDate: new Date().toISOString().split('T')[0],
      fileName: '',
      version: '',
    },
    projectDescription: {
      description: '',
      startDate: '',
      duration: '',
      maxWorkers: 0,
    },
    siteInformation: {
      address: {
        line1: '',
        town: '',
        county: '',
        postCode: '',
      },
      accessRestrictions: '',
      parkingArrangements: '',
      existingEnvironment: '',
      surroundingLandUse: '',
      existingServices: [],
    },
    hoursTeam: {
      workingHours: '',
      outOfHoursContact: '',
      keyMembers: [],
    },
    managementWork: {
      supervisionArrangements: '',
      trainingArrangements: '',
      consultationArrangements: '',
    },
    managementStructure: {
      roles: [],
    },
    siteRules: {
      generalRules: [],
      ppeRequirements: [],
      permitToWork: [],
      trafficManagement: '',
    },
    arrangements: {
      deliveries: '',
      storage: '',
      security: '',
      electricity: '',
      lighting: '',
    },
    siteInduction: {
      inductionTopics: [],
      inductionProcess: '',
      recordKeeping: '',
    },
    welfareArrangements: {
      toilets: '',
      restAreas: '',
      dryingRooms: '',
      drinking: '',
      handwashing: '',
    },
    firstAidArrangements: {
      firstAiders: [],
      equipment: [],
      procedures: '',
    },
    rescuePlan: {
      emergencyProcedures: '',
      assemblyPoints: [],
      contactNumbers: [],
    },
    specificMeasures: {
      covid19: '',
      noiseVibration: '',
      dustControl: '',
      wasteManagement: '',
      environmentalProtection: '',
    },
    hazards: [],
    highRiskWork: {
      activities: [],
    },
    notifiableWork: {
      isNotifiable: false,
    },
    contractors: [],
    monitoring: {
      inspectionSchedule: '',
      reviewProcess: '',
      responsiblePerson: '',
      recordKeeping: '',
    },
    hsFile: {
      arrangements: '',
      information: '',
      format: '',
      handover: '',
    },
    hazardIdentification: {
      workingAtHeight: {
        selected: false,
        fenceOff: false,
        isolateHazard: false,
        useCatchment: false,
        equipmentFitForPurpose: false,
        useFallRestraint: false,
      },
      scaffolding: {
        selected: false,
        competentInstaller: false,
        regularlyChecked: false,
        fitForPurpose: false,
      },
      mewp: {
        selected: false,
        certified: false,
        competentPerson: false,
        preStartChecks: false,
        useHarness: false,
      },
      demolitionAsbestos: {
        selected: false,
        enclosures: false,
        managementPlan: false,
        controlPlan: false,
        certificates: false,
        airMonitoring: false,
        clearanceInspection: false,
        hseNotification: false,
        decontamination: false,
        deenergiseServices: false,
        dampenArea: false,
        wasteDisposal: false,
        weatherConditions: false,
      },
      demolitionNoAsbestos: {
        selected: false,
        deenergiseServices: false,
        dampenArea: false,
        wasteDisposal: false,
        weatherConditions: false,
      },
      excavations: {
        selected: false,
        coverHoles: false,
        identifyServices: false,
        useShoring: false,
        keepClear: false,
        regularServicing: false,
        appropriateWeather: false,
        dailyInspection: false,
      },
      heavyMachinery: {
        selected: false,
        turnOffAndLower: false,
        keepClear: false,
        lowerBucket: false,
        stayVisible: false,
        regularInspections: false,
        weightLimits: false,
        equipmentRegister: false,
      },
      concrete: {
        selected: false,
        noWorkAbove: false,
        capExposed: false,
        eyewashFacilities: false,
        regularServicing: false,
        hazardousRegister: false,
        msdsAvailable: false,
      },
      hotWorks: {
        selected: false,
        clearArea: false,
        secureGasBottles: false,
        fireExtinguisher: false,
        permitRequired: false,
      },
      temporarySupports: {
        selected: false,
        approvedProps: false,
        goodCondition: false,
      },
      handlingGlass: {
        selected: false,
        keepClear: false,
        noWorkUnderneath: false,
        correctDisposal: false,
        immediateCleanup: false,
      },
      hazardousSubstances: {
        selected: false,
        correctStorage: false,
        licensedHandlers: false,
        coshhAssessment: false,
        sdsAvailable: false,
      },
      crampedConditions: {
        selected: false,
        comfortableExit: false,
        standbyPerson: false,
        ventilationLighting: false,
      },
      confinedSpace: {
        selected: false,
        authorizedOnly: false,
        testingAndPermit: false,
        responseplan: false,
      },
    },
  });

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    console.log('Saving CPP data:', formData);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Ensure user exists in users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({ id: user.id }, { onConflict: 'id' });

      if (userError) throw userError;

      // Transform form data to match database column names
      const transformedData = {
        front_cover: formData.frontCover,
        project_description: formData.projectDescription,
        site_information: formData.siteInformation,
        hours_team: formData.hoursTeam,
        management_work: formData.managementWork,
        management_structure: formData.managementStructure,
        site_rules: formData.siteRules,
        arrangements: formData.arrangements,
        site_induction: formData.siteInduction,
        welfare_arrangements: formData.welfareArrangements,
        first_aid_arrangements: formData.firstAidArrangements,
        rescue_plan: formData.rescuePlan,
        specific_measures: formData.specificMeasures,
        hazards: formData.hazards,
        high_risk_work: formData.highRiskWork,
        notifiable_work: formData.notifiableWork,
        contractors: formData.contractors,
        monitoring: formData.monitoring,
        hs_file: formData.hsFile,
        hazard_identification: formData.hazardIdentification,
      };

      // Validate fields based on current step
      switch (currentStep) {
        case 1:
          if (!formData.frontCover.projectId)
            throw new Error('Step 1: Project is required');
          if (!formData.frontCover.projectReference)
            throw new Error('Step 1: Project reference is required');
          if (!formData.frontCover.projectName)
            throw new Error('Step 1: Project name is required');
          if (!formData.frontCover.fileName)
            throw new Error('Step 1: File name is required');
          if (!formData.frontCover.version)
            throw new Error('Step 1: Version is required');
          break;
        case 2:
          if (!formData.siteInformation.address.line1)
            throw new Error('Step 2: Site address is required');
          if (!formData.siteInformation.address.town)
            throw new Error('Step 2: Site town is required');
          if (!formData.siteInformation.address.county)
            throw new Error('Step 2: Site county is required');
          if (!formData.siteInformation.address.postCode)
            throw new Error('Step 2: Site post code is required');
          break;
        // Add validation for other steps as needed
      }

      // Save the CPP data
      let error;
      if (cppToEdit) {
        // Update existing CPP
        ({ error } = await supabase
          .from('cpps')
          .update({
            ...transformedData,
            user_id: user.id,
            review_date: (() => {
              const date = new Date();
              date.setFullYear(date.getFullYear() + 1);
              return date.toISOString();
            })(),
          })
          .eq('id', cppToEdit.id));
      } else {
        // Create new CPP
        ({ error } = await supabase.from('cpps').insert([
          {
            ...transformedData,
            user_id: user.id,
            review_date: (() => {
              const date = new Date();
              date.setFullYear(date.getFullYear() + 1);
              return date.toISOString();
            })(),
          },
        ]));
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving CPP:', {
        error: err,
        formData: formData,
      });

      if (err instanceof Error) {
        // Handle Supabase error object
        if ('code' in err) {
          const supabaseError = err as {
            code: string;
            message: string;
            details?: string;
          };
          setError(
            `Database error (${supabaseError.code}): ${supabaseError.message}${
              supabaseError.details ? `\nDetails: ${supabaseError.details}` : ''
            }`
          );
        } else {
          setError(err.message);
        }
      } else if (typeof err === 'object' && err !== null) {
        // Handle other error objects
        setError(JSON.stringify(err, null, 2));
      } else {
        setError('An unexpected error occurred while saving the CPP');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateCurrentStep = () => {
    // Add validation logic for each step
    return null;
  };

  const handleNext = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    nextStep();
  };

  const handlePrevious = () => {
    setError(null);
    previousStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1FrontCover data={formData} onChange={handleChange} />;
      case 2:
        return <Step2SiteInformation data={formData} onChange={handleChange} />;
      case 3:
        return (
          <Step3ProjectDescription data={formData} onChange={handleChange} />
        );
      case 4:
        return <Step4HoursTeam data={formData} onChange={handleChange} />;
      case 5:
        return <Step5ManagementWork data={formData} onChange={handleChange} />;
      case 6:
        return (
          <Step6ManagementStructure data={formData} onChange={handleChange} />
        );
      case 7:
        return <Step7SiteRules data={formData} onChange={handleChange} />;
      case 8:
        return <Step8Arrangements data={formData} onChange={handleChange} />;
      case 9:
        return <Step9SiteInduction data={formData} onChange={handleChange} />;
      case 10:
        return (
          <Step10WelfareArrangements data={formData} onChange={handleChange} />
        );
      case 11:
        return (
          <Step11FirstAidArrangements data={formData} onChange={handleChange} />
        );
      case 12:
        return <Step12RescuePlan data={formData} onChange={handleChange} />;
      case 13:
        return (
          <Step13SpecificMeasures data={formData} onChange={handleChange} />
        );
      case 14:
        return (
          <Step20HIdentification data={formData} onChange={handleChange} />
        );
      case 15:
        return <Step14Hazards data={formData} onChange={handleChange} />;
      case 16:
        return (
          <Step15HighRiskConstructionWork
            data={formData}
            onChange={handleChange}
          />
        );
      case 17:
        return <Step16NotifiableWork data={formData} onChange={handleChange} />;
      case 18:
        return <Step17Contractors data={formData} onChange={handleChange} />;
      case 19:
        return <Step18Mon data={formData} onChange={handleChange} />;
      default:
        return null;
    }
  };

  const handleChange = (updates: Partial<CPPFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto h-full w-full flex items-start sm:items-center justify-center p-4 z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-8 max-w-4xl w-full m-4 max-h-[calc(100vh-2rem)] sm:max-h-[800px] flex flex-col" ref={modalRef}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {cppToEdit ? 'Edit CPP' : 'New CPP'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  index + 1 <= currentStep 
                    ? 'bg-indigo-600 dark:bg-indigo-500' 
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
              {renderStep()}

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6 mt-6 border-t">
            <div className="flex justify-start">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-red-600 dark:hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-4 w-4 mr-1 inline" style={{ marginTop: '-2px' }}><path d="m15 18-6-6 6-6"></path></svg>Previous
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-red-600 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Progress'}
              </button>
              {currentStep === 19 ? (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Complete & Save'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto"
                >
                  Next<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right h-4 w-4 ml-1 inline" style={{ marginTop: '-2px' }}><path d="m9 18 6-6-6-6"></path></svg>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
