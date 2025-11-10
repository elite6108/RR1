import { FormFieldConfigs } from '../types';

// Define field configurations for each form type
export const FORM_FIELD_CONFIGS: FormFieldConfigs = {
  'accidents_personalinjury': {
    title: 'PERSONAL INJURY REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_nearmiss': {
    title: 'NEAR MISS REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' },
          { key: 'basic_cause_of_incident', label: 'Basic Cause of Incident', type: 'text' },
          { key: 'source_of_hazard', label: 'Source of Hazard', type: 'text' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_fatality': {
    title: 'FATALITY REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',  
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_dangerousoccurrence': {
    title: 'DANGEROUS OCCURRENCE REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' },
          { key: 'basic_cause_of_incident', label: 'Basic Cause of Incident', type: 'text' },
          { key: 'source_of_hazard', label: 'Source of Hazard', type: 'text' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_environmental': {
    title: 'ENVIRONMENTAL INCIDENT REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' },
          { key: 'environmental_incident_type', label: 'Environmental Incident Type', type: 'text' },
          { key: 'severity_of_incident', label: 'Severity of Incident', type: 'text' },
          { key: 'basic_cause_of_incident', label: 'Basic Cause of Incident', type: 'text' },
          { key: 'source_of_hazard', label: 'Source of Hazard', type: 'text' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_propertydamage': {
    title: 'PROPERTY DAMAGE REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' },
          { key: 'affected_items', label: 'Affected Items', type: 'text' },
          { key: 'basic_cause_of_incident', label: 'Basic Cause of Incident', type: 'text' },
          { key: 'source_of_hazard', label: 'Source of Hazard', type: 'text' }
        ]
      },
      {
        title: 'REPORTING INFORMATION',
        fields: [
          { key: 'reporting_datetime', label: 'Reporting Date/Time', type: 'datetime' },
          { key: 'reporter_name', label: 'Reporter Name', type: 'text' },
          { key: 'crime_reference', label: 'Crime Reference', type: 'text' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_unsafeactions': {
    title: 'UNSAFE ACTIONS REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' },
          { key: 'basic_cause_of_incident', label: 'Basic Cause of Incident', type: 'text' },
          { key: 'source_of_hazard', label: 'Source of Hazard', type: 'text' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_unsafeconditions': {
    title: 'UNSAFE CONDITIONS REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' },
          { key: 'hazard_source', label: 'Hazard Source', type: 'text' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_utilitydamage': {
    title: 'UTILITY DAMAGE REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' },
          { key: 'service_description', label: 'Service Description', type: 'text' },
          { key: 'service_owner', label: 'Service Owner', type: 'text' },
          { key: 'cause_damage', label: 'Cause of Damage', type: 'text' }
        ]
      },
      {
        title: 'REPAIR DETAILS',
        fields: [
          { key: 'plant_owner_name', label: 'Plant Owner Name', type: 'text' },
          { key: 'repair_service', label: 'Repair Service', type: 'text' },
          { key: 'repair_date', label: 'Repair Date', type: 'date' },
          { key: 'responsible_person', label: 'Responsible Person', type: 'text' },
          { key: 'notes', label: 'Notes', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_hospitaltreatment': {
    title: 'HOSPITAL TREATMENT REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_illhealth': {
    title: 'ILL HEALTH REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_minoraccident': {
    title: 'MINOR ACCIDENT REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_nonfatal': {
    title: 'NON-FATAL ACCIDENT REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_occupationaldisease': {
    title: 'OCCUPATIONAL DISEASE REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_sevendayincapacitation': {
    title: 'SEVEN DAY INCAPACITATION REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  },
  'accidents_specifiedinjuries': {
    title: 'SPECIFIED INJURIES REPORT',
    sections: [
      {
        title: 'INCIDENT DETAILS',
        fields: [
          { key: 'incident_location', label: 'Location', type: 'text' },
          { key: 'incident_date', label: 'Injury / Incident Date', type: 'date' },
          { key: 'incident_description', label: 'Description', type: 'textarea' }
        ]
      },
      {
        title: 'INJURED PERSON DETAILS',
        fields: [
          { key: 'injured_person_name', label: 'Name', type: 'text' },
          { key: 'injured_person_address', label: 'Address', type: 'textarea' },
          { key: 'injured_person_phone', label: 'Phone', type: 'text' },
          { key: 'injured_person_position', label: 'Position', type: 'text' },
          { key: 'time_lost', label: 'Time Lost', type: 'boolean' },
          { key: 'time_lost_start_date', label: 'Time Lost Start Date', type: 'date' },
          { key: 'time_lost_end_date', label: 'Time Lost End Date', type: 'date' },
          { key: 'ae_hospital_name', label: 'A&E Hospital Name', type: 'text' },
          { key: 'required_ppe', label: 'Required PPE', type: 'text' },
          { key: 'worn_ppe', label: 'Worn PPE', type: 'text' }
        ]
      },
      {
        title: 'INJURY DETAILS',
        fields: [
          { key: 'injury_locations', label: 'Injury Locations', type: 'array' },
          { key: 'injury_types', label: 'Injury Types', type: 'array' }
        ]
      },
      {
        title: 'FIRST AID & MEDICAL',
        fields: [
          { key: 'advised_medical', label: 'Advised Medical', type: 'boolean' },
          { key: 'drug_alcohol_test', label: 'Drug/Alcohol Test', type: 'boolean' },
          { key: 'first_aid_details', label: 'First Aid Details', type: 'textarea' }
        ]
      },
      {
        title: 'INVESTIGATION',
        fields: [
          { key: 'basic_cause', label: 'Basic Cause', type: 'text' },
          { key: 'root_cause_work_environment', label: 'Work Environment Factors', type: 'array' },
          { key: 'root_cause_human_factors', label: 'Human Factors', type: 'array' },
          { key: 'root_cause_ppe', label: 'PPE Factors', type: 'array' },
          { key: 'root_cause_management', label: 'Management Factors', type: 'array' },
          { key: 'root_cause_plant_equipment', label: 'Plant/Equipment Factors', type: 'array' }
        ]
      },
      {
        title: 'ACTIONS',
        fields: [
          { key: 'actions_taken', label: 'Actions Taken', type: 'textarea' },
          { key: 'actions', label: 'Action Items', type: 'actions' }
        ]
      }
    ]
  }
};
