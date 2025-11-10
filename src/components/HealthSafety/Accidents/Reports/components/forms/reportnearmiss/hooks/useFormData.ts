import { useState, useEffect } from 'react';
import { supabase } from '../../../../../../../../lib/supabase';
import { FormData } from '../types/FormData';

export function useFormData(
  isEditing: boolean,
  initialData: any,
  autoId: string,
  defaultReportType: string,
  bucketName: string
) {
  const [formData, setFormData] = useState<FormData>(() => {
    if (isEditing && initialData) {
      console.log('Editing form with initial data:', initialData);
      
      return {
        // Incident Details
        date: initialData.date || '',
        time: initialData.time || '',
        location: initialData.location || '',
        department: initialData.department || '',
        description: initialData.description || '',
        potentialSeverity: initialData.potentialSeverity || '',
        
        // Contributing Factors
        unsafeCondition: initialData.unsafeCondition || false,
        unsafeAct: initialData.unsafeAct || false,
        equipmentFailure: initialData.equipmentFailure || false,
        lackOfProcedure: initialData.lackOfProcedure || false,
        inadequateTraining: initialData.inadequateTraining || false,
        otherFactors: initialData.otherFactors || '',
        
        // Potential Consequences
        potentialInjuryType: initialData.potentialInjuryType || '',
        potentialDamageType: initialData.potentialDamageType || '',
        potentialEnvironmentalImpact: initialData.potentialEnvironmentalImpact || '',
        
        // Reporting Information
        reportedBy: initialData.reportedBy || '',
        reportedDate: initialData.reportedDate || '',
        supervisorNotified: initialData.supervisorNotified || false,
        supervisorName: initialData.supervisorName || '',
        
        // Immediate Actions
        immediateActionsTaken: initialData.immediateActionsTaken || '',
        
        // Preventive Measures
        recommendedActions: initialData.recommendedActions || '',
        responsiblePerson: initialData.responsiblePerson || '',
        targetCompletionDate: initialData.targetCompletionDate || '',
        lessonLearned: initialData.lessonLearned || '',

        // Form specific fields
        autoId: initialData.autoId || initialData.auto_id || autoId,
        reportType: initialData.reportType || initialData.report_type || defaultReportType,
        category: initialData.category || 'Report a Near Miss',
        incidentLocation: initialData.incidentLocation || initialData.incident_location || '',
        incidentDate: initialData.incidentDate || initialData.incident_date || '',
        incidentDescription: initialData.incidentDescription || initialData.incident_description || '',
        basicCause: initialData.basicCause || initialData.basicCauseOfIncident || initialData.basic_cause_of_incident || '',
        sourceOfHazard: initialData.sourceOfHazard || initialData.source_of_hazard || '',
        rootCauseWorkEnvironment: initialData.rootCauseWorkEnvironment || initialData.root_cause_work_environment || [],
        rootCauseHumanFactors: initialData.rootCauseHumanFactors || initialData.root_cause_human_factors || [],
        rootCausePpe: initialData.rootCausePpe || initialData.root_cause_ppe || [],
        rootCauseManagement: initialData.rootCauseManagement || initialData.root_cause_management || [],
        rootCausePlantEquipment: initialData.rootCausePlantEquipment || initialData.root_cause_plant_equipment || [],
        actionsTaken: initialData.actionsTaken || initialData.actions_taken || '',
        actions: initialData.actions || [],
        file_urls: [], // Initialize empty, will be handled by useEffect
      };
    }
    
    return {
      // Default values for new form
      date: '',
      time: '',
      location: '',
      department: '',
      description: '',
      potentialSeverity: '',
      unsafeCondition: false,
      unsafeAct: false,
      equipmentFailure: false,
      lackOfProcedure: false,
      inadequateTraining: false,
      otherFactors: '',
      potentialInjuryType: '',
      potentialDamageType: '',
      potentialEnvironmentalImpact: '',
      reportedBy: '',
      reportedDate: '',
      supervisorNotified: false,
      supervisorName: '',
      immediateActionsTaken: '',
      recommendedActions: '',
      responsiblePerson: '',
      targetCompletionDate: '',
      lessonLearned: '',
      autoId,
      reportType: defaultReportType,
      category: 'Report a Near Miss',
      incidentLocation: '',
      incidentDate: '',
      incidentDescription: '',
      basicCause: '',
      sourceOfHazard: '',
      rootCauseWorkEnvironment: [],
      rootCauseHumanFactors: [],
      rootCausePpe: [],
      rootCauseManagement: [],
      rootCausePlantEquipment: [],
      actionsTaken: '',
      actions: [],
      file_urls: [],
    };
  });

  // Update autoId in form data when it changes
  useEffect(() => {
    if (autoId && !isEditing) {
      console.log('Updating form data with autoId:', autoId);
      setFormData(prev => ({ ...prev, autoId }));
    }
  }, [autoId, isEditing]);

  // Handle file URL refreshing for editing forms
  useEffect(() => {
    if (isEditing && initialData) {
      console.log('UseEffect: Processing file URLs for editing form');
      console.log('UseEffect: Full initialData object:', JSON.stringify(initialData, null, 2));
      
      const fileUrlsFromDb = initialData.file_urls || initialData.fileUrls;
      
      if (fileUrlsFromDb) {
        console.log('UseEffect: Found file URLs in database:', fileUrlsFromDb);
        let fileUrls: string[] = [];
        
        if (typeof fileUrlsFromDb === 'string') {
          try {
            fileUrls = JSON.parse(fileUrlsFromDb);
            console.log('UseEffect: Parsed file URLs from string:', fileUrls);
          } catch (e) {
            console.error('UseEffect: Error parsing file_urls:', e);
            fileUrls = [];
          }
        } else if (Array.isArray(fileUrlsFromDb)) {
          fileUrls = fileUrlsFromDb;
          console.log('UseEffect: Using file URLs as array:', fileUrls);
        }
        
        // Filter valid URLs
        fileUrls = fileUrls.filter((url: any) => url && typeof url === 'string');
        console.log('UseEffect: Filtered file URLs:', fileUrls);
        
        if (fileUrls.length > 0) {
          console.log('UseEffect: Setting file URLs in form data');
          // Set the URLs immediately first
          setFormData(prev => {
            console.log('UseEffect: Updating form data with file URLs:', fileUrls);
            return { ...prev, file_urls: fileUrls };
          });
          
          // Then refresh the signed URLs
          const refreshUrls = async () => {
            console.log('UseEffect: Starting to refresh signed URLs...');
            try {
              const newUrls = await Promise.all(
                fileUrls.map(async (url: any) => {
                  const pathMatch = url.match(/\/object\/sign\/([^?]+)/);
                  if (pathMatch) {
                    let path = pathMatch[1];
                    console.log('UseEffect: Extracted path from URL:', path);
                    
                    // Remove the bucket name if it's at the beginning of the path
                    if (path.startsWith(`${bucketName}/`)) {
                      path = path.replace(`${bucketName}/`, '');
                      console.log('UseEffect: Cleaned path (removed bucket name):', path);
                    }
                    
                    console.log('UseEffect: Refreshing URL for path:', path);
                    const { data, error } = await supabase.storage
                      .from(bucketName)
                      .createSignedUrl(path, 60 * 60 * 24 * 7);
                    
                    if (data?.signedUrl) {
                      console.log('UseEffect: Successfully refreshed URL');
                      return data.signedUrl;
                    } else {
                      console.error('UseEffect: Error refreshing URL:', error);
                    }
                  }
                  return url;
                })
              );
              
              console.log('UseEffect: All refreshed URLs:', newUrls);
              setFormData(prev => ({ ...prev, file_urls: newUrls }));
            } catch (error) {
              console.error('UseEffect: Error refreshing signed URLs:', error);
            }
          };
          
          // Small delay to ensure component is mounted
          setTimeout(refreshUrls, 100);
        } else {
          console.log('UseEffect: No valid file URLs found after filtering');
        }
      } else {
        console.log('UseEffect: No file URLs field found in initialData');
      }
    }
  }, [isEditing, initialData, bucketName]);

  return { formData, setFormData };
}
