import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import type { RAMS } from '../../../../../types/database';
import type { RAMSFormData } from '../../../../../types/rams';
import { RAMS_DEFAULTS } from '../../../../../types/rams';

// Import all screen components
import { ProjectInformation } from './01-ProjectInformation';
import { SiteAddress } from './02-SiteAddress';
import { SiteHours } from './03-SiteHours';
import { SupervisorArrangements } from './04-SupervisorArrangements';
import { DescriptionOfWorks } from './05-DescriptionOfWorks';
import { OperationalSequence } from './06-OperationalSequence';
import { StabilityAndPermits } from './07-StabilityAndPermits';
import { Workers } from './08-Workers';
import { ToolsAndPlant } from './09-ToolsAndPlant';
import { Lighting } from './10-Lighting';
import { Deliveries } from './11-Deliveries';
import { Services } from './12-Services';
import { AccessEquipment } from './13-AccessEquipment';
import { HazardousEquipment } from './14-HazardousEquipment';
import { PPE } from './15-PPE';
import { WelfareAndFirstAid } from './16-WelfareAndFirstAid';
import { FireActionPlan } from './17-FireActionPlan';
import { ProtectionOfPublic } from './18-ProtectionOfPublic';
import { CleanUp } from './19-CleanUp';
import { OrderOfWorks } from './20-OrderOfWorks';
import { OrderOfWorksTasks } from './21-OrderOfWorksTasks';
import { RisksAndHazards } from './22-RisksAndHazards';

interface RAMSFormProps {
  onClose: () => void;
  onSuccess: () => void;
  ramsToEdit?: RAMS | null;
}

type Step = 
  | '01-project'
  | '02-site'
  | '03-hours'
  | '04-supervisor'
  | '05-description'
  | '06-sequence'
  | '07-stability'
  | '08-workers'
  | '09-tools'
  | '10-lighting'
  | '11-deliveries'
  | '12-services'
  | '13-access'
  | '14-hazardous'
  | '15-ppe'
  | '16-welfare'
  | '17-fire'
  | '18-public'
  | '19-cleanup'
  | '20-works'
  | '21-tasks'
  | '22-hazards';

export function RAMSForm({ onClose, onSuccess, ramsToEdit }: RAMSFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>('01-project');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RAMSFormData>({
    reference: ramsToEdit?.reference || '',
    client_id: ramsToEdit?.client_id || '',
    client_name: ramsToEdit?.client_name || '',
    project_id: ramsToEdit?.project_id || '',
    site_manager: ramsToEdit?.site_manager || '',
    assessor: ramsToEdit?.assessor || '',
    approved_by: ramsToEdit?.approved_by || RAMS_DEFAULTS.APPROVED_BY,
    address_line1: ramsToEdit?.address_line1 || '',
    address_line2: ramsToEdit?.address_line2 || '',
    address_line3: ramsToEdit?.address_line3 || '',
    site_town: ramsToEdit?.site_town || '',
    site_county: ramsToEdit?.site_county || '',
    post_code: ramsToEdit?.post_code || '',
    site_hours: ramsToEdit?.site_hours || '',
    supervision: ramsToEdit?.supervision || '',
    description: ramsToEdit?.description || RAMS_DEFAULTS.DESCRIPTION,
    sequence: ramsToEdit?.sequence || RAMS_DEFAULTS.SEQUENCE,
    stability: ramsToEdit?.stability || '',
    special_permits: ramsToEdit?.special_permits || '',
    workers: ramsToEdit?.workers || '',
    tools_equipment: ramsToEdit?.tools_equipment || '',
    plant_equipment: ramsToEdit?.plant_equipment || '',
    lighting: ramsToEdit?.lighting || '',
    deliveries: ramsToEdit?.deliveries || '',
    services: ramsToEdit?.services || '',
    access_equipment: ramsToEdit?.access_equipment || '',
    hazardous_equipment: ramsToEdit?.hazardous_equipment || '',
    welfare_first_aid: ramsToEdit?.welfare_first_aid || '',
    nearest_hospital: ramsToEdit?.nearest_hospital || '',
    fire_action_plan: ramsToEdit?.fire_action_plan || '',
    protection_of_public: ramsToEdit?.protection_of_public || '',
    clean_up: ramsToEdit?.clean_up || '',
    order_of_works_safety: ramsToEdit?.order_of_works_safety || '',
    order_of_works_task: ramsToEdit?.order_of_works_task || RAMS_DEFAULTS.ORDER_OF_WORKS_TASK,
    order_of_works_custom: ramsToEdit?.order_of_works_custom || '',
    delivery_info: ramsToEdit?.delivery_info || '',
    groundworks_info: ramsToEdit?.groundworks_info || '',
    additional_info: ramsToEdit?.additional_info || '',
    ppe: ramsToEdit?.ppe || [],
    hazards: ramsToEdit?.hazards || []
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (data: Partial<RAMSFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case '01-project':
        if (!formData.reference || !formData.reference.trim()) return 'Reference is required';
        if (!formData.client_name || !formData.client_name.trim()) return 'Client is required';
        if (!formData.site_manager || !formData.site_manager.trim()) return 'Site Manager is required';
        if (!formData.assessor || !formData.assessor.trim()) return 'Assessor is required';
        break;
      case '02-site':
        if (!formData.address_line1 || !formData.address_line1.trim()) return 'First line of address is required';
        if (!formData.site_town || !formData.site_town.trim()) return 'Town is required';
        if (!formData.site_county || !formData.site_county.trim()) return 'County is required';
        if (!formData.post_code || !formData.post_code.trim()) return 'Post code is required';
        break;
      case '05-description':
        if (!formData.description || !formData.description.trim()) return 'Description is required';
        break;
      case '06-sequence':
        if (!formData.sequence || !formData.sequence.trim()) return 'Operational sequence is required';
        break;
      case '22-hazards':
        if (!formData.hazards?.length) return 'At least one hazard is required';
        break;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!e.isTrusted) {
      // Prevent programmatic form submissions
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const validationError = validateCurrentStep();
      if (validationError) {
        throw new Error(validationError);
      }

      let error;
      if (ramsToEdit) {
        // Update existing RAMS
        ({ error } = await supabase
          .from('rams')
          .update({
            reference: formData.reference,
            client_id: formData.client_id || null,
            client_name: formData.client_name,
            project_id: formData.project_id || null,
            site_manager: formData.site_manager,
            assessor: formData.assessor,
            approved_by: formData.approved_by,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2 || null,
            address_line3: formData.address_line3 || null,
            site_town: formData.site_town,
            site_county: formData.site_county,
            post_code: formData.post_code,
            site_hours: formData.site_hours,
            supervision: formData.supervision,
            description: formData.description || null,
            sequence: formData.sequence || null,
            stability: formData.stability || null,
            special_permits: formData.special_permits || null,
            workers: formData.workers || null,
            tools_equipment: formData.tools_equipment || null,
            plant_equipment: formData.plant_equipment || null,
            lighting: formData.lighting || null,
            deliveries: formData.deliveries || null,
            services: formData.services || null,
            access_equipment: formData.access_equipment || null,
            hazardous_equipment: formData.hazardous_equipment || null,
            welfare_first_aid: formData.welfare_first_aid || null,
            nearest_hospital: formData.nearest_hospital || null,
            fire_action_plan: formData.fire_action_plan || null,
            protection_of_public: formData.protection_of_public || null,
            clean_up: formData.clean_up || null,
            order_of_works_safety: formData.order_of_works_safety || null,
            order_of_works_task: formData.order_of_works_task || null,
            order_of_works_custom: formData.order_of_works_custom || null,
            delivery_info: formData.delivery_info || null,
            groundworks_info: formData.groundworks_info || null,
            additional_info: formData.additional_info || null,
            ppe: formData.ppe || [],
            hazards: formData.hazards || []
          })
          .eq('id', ramsToEdit.id));
      } else {
        // Create new RAMS
        ({ error } = await supabase
          .from('rams')
          .insert([{
            ...formData,
            client_id: formData.client_id || null,
            project_id: formData.project_id || null,
            user_id: user.id,
            date: new Date().toISOString().split('T')[0]
          }]));
      }

      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving RAMS:', err);
      // Show detailed error message
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null) {
        // Handle Supabase error object
        const supabaseError = err as { message?: string; details?: string; hint?: string };
        setError(
          [
            supabaseError.message,
            supabaseError.details,
            supabaseError.hint
          ].filter(Boolean).join('\n')
        );
      } else {
        setError('An unexpected error occurred while saving the RAMS');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    const steps: Step[] = [
      '01-project', '02-site', '03-hours', '04-supervisor',
      '05-description', '06-sequence', '07-stability', '08-workers',
      '09-tools', '10-lighting', '11-deliveries', '12-services',
      '13-access', '14-hazardous', '15-ppe', '16-welfare',
      '17-fire', '18-public', '19-cleanup', '20-works',
      '21-tasks', '22-hazards'
    ];

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    setError(null);
    const steps: Step[] = [
      '01-project', '02-site', '03-hours', '04-supervisor',
      '05-description', '06-sequence', '07-stability', '08-workers',
      '09-tools', '10-lighting', '11-deliveries', '12-services',
      '13-access', '14-hazardous', '15-ppe', '16-welfare',
      '17-fire', '18-public', '19-cleanup', '20-works',
      '21-tasks', '22-hazards'
    ];

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const getCurrentStepNumber = () => {
    const steps: Step[] = [
      '01-project', '02-site', '03-hours', '04-supervisor',
      '05-description', '06-sequence', '07-stability', '08-workers',
      '09-tools', '10-lighting', '11-deliveries', '12-services',
      '13-access', '14-hazardous', '15-ppe', '16-welfare',
      '17-fire', '18-public', '19-cleanup', '20-works',
      '21-tasks', '22-hazards'
    ];
    return steps.indexOf(currentStep) + 1;
  };

  const getStepLabel = () => {
    switch (currentStep) {
      case '01-project':
        return 'Project Information';
      case '02-site':
        return 'Site Address';
      case '03-hours':
        return 'Site Hours';
      case '04-supervisor':
        return 'Supervisor Arrangements';
      case '05-description':
        return 'Description of Works';
      case '06-sequence':
        return 'Operational Sequence';
      case '07-stability':
        return 'Stability and Permits';
      case '08-workers':
        return 'Workers';
      case '09-tools':
        return 'Tools and Plant';
      case '10-lighting':
        return 'Lighting';
      case '11-deliveries':
        return 'Deliveries';
      case '12-services':
        return 'Services';
      case '13-access':
        return 'Access Equipment';
      case '14-hazardous':
        return 'Hazardous Equipment';
      case '15-ppe':
        return 'PPE';
      case '16-welfare':
        return 'Welfare and First Aid';
      case '17-fire':
        return 'Fire Action Plan';
      case '18-public':
        return 'Protection of Public';
      case '19-cleanup':
        return 'Clean Up';
      case '20-works':
        return 'Order of Works';
      case '21-tasks':
        return 'Order of Works Tasks';
      case '22-hazards':
        return 'Risks and Hazards';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case '01-project':
        return <ProjectInformation data={formData} onChange={handleChange} />;
      case '02-site':
        return <SiteAddress data={formData} onChange={handleChange} />;
      case '03-hours':
        return <SiteHours data={formData} onChange={handleChange} />;
      case '04-supervisor':
        return <SupervisorArrangements data={formData} onChange={handleChange} />;
      case '05-description':
        return <DescriptionOfWorks data={formData} onChange={handleChange} />;
      case '06-sequence':
        return <OperationalSequence data={formData} onChange={handleChange} />;
      case '07-stability':
        return <StabilityAndPermits data={formData} onChange={handleChange} />;
      case '08-workers':
        return <Workers data={formData} onChange={handleChange} />;
      case '09-tools':
        return <ToolsAndPlant data={formData} onChange={handleChange} />;
      case '10-lighting':
        return <Lighting data={formData} onChange={handleChange} />;
      case '11-deliveries':
        return <Deliveries data={formData} onChange={handleChange} />;
      case '12-services':
        return <Services data={formData} onChange={handleChange} />;
      case '13-access':
        return <AccessEquipment data={formData} onChange={handleChange} />;
      case '14-hazardous':
        return <HazardousEquipment data={formData} onChange={handleChange} />;
      case '15-ppe':
        return <PPE data={formData} onChange={handleChange} />;
      case '16-welfare':
        return <WelfareAndFirstAid data={formData} onChange={handleChange} />;
      case '17-fire':
        return <FireActionPlan data={formData} onChange={handleChange} />;
      case '18-public':
        return <ProtectionOfPublic data={formData} onChange={handleChange} />;
      case '19-cleanup':
        return <CleanUp data={formData} onChange={handleChange} />;
      case '20-works':
        return <OrderOfWorks data={formData} onChange={handleChange} />;
      case '21-tasks':
        return <OrderOfWorksTasks data={formData} onChange={handleChange} />;
      case '22-hazards':
        return <RisksAndHazards data={formData} onChange={handleChange} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 z-50"></div>
      <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center z-50 min-h-screen">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg-xl w-full max-w-4xl m-4 my-8 max-h-[800px] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{ramsToEdit ? 'Edit RAMS' : 'New RAMS'}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-8 w-full mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-medium text-indigo-600 dark:text-indigo-400">
                  {getStepLabel()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Step {getCurrentStepNumber()} of 22
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(getCurrentStepNumber() / 22) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                  {currentStep !== '01-project' && (
                    <button
                      type="button"
                      onClick={previousStep}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1 inline" style={{ marginTop: '-2px' }}><path d="m15 18-6-6 6-6"></path></svg>
                      Previous
                    </button>
                  )}
                  {currentStep === '22-hazards' ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : ramsToEdit ? 'Update RAMS' : 'Save RAMS'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 inline" style={{ marginTop: '-2px' }}><path d="m9 18 6-6-6-6"></path></svg>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}