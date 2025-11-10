import type { TrainingItem } from '../types';

// Training items grouped by category
export const trainingItemsByCategory: { [key: string]: TrainingItem[] } = {
  "Construction - Safety & Health": [
    { id: "asbestos_awareness", training_name: "Asbestos Awareness (UKATA)" },
    { id: "abrasive_wheels", training_name: "Abrasive Wheels Training" },
    { id: "banksman_traffic_marshal", training_name: "Banksman / Traffic Marshal" },
    { id: "confined_space_awareness", training_name: "Confined Space Awareness" },
    { id: "coshh_awareness", training_name: "COSHH Awareness" },
    { id: "face_fit_testing", training_name: "Face Fit Testing" },
    { id: "fire_marshal_construction", training_name: "Fire Marshal (Construction Site)" },
    { id: "first_aid_work", training_name: "First Aid at Work" },
    { id: "health_safety_awareness_citb", training_name: "Health & Safety Awareness (CITB)" },
    { id: "iosh_working_safely", training_name: "IOSH Working Safely" },
    { id: "iosh_managing_safely", training_name: "IOSH Managing Safely" },
    { id: "manual_handling_construction", training_name: "Manual Handling (Construction-Specific)" },
    { id: "risk_assessment_training", training_name: "Risk Assessment Training" },
    { id: "seats", training_name: "Site Environmental Awareness Training Scheme (SEATS)" },
    { id: "smsts", training_name: "Site Management Safety Training Scheme (SMSTS)" },
    { id: "sssts", training_name: "Site Supervision Safety Training Scheme (SSSTS)" },
    { id: "vehicle_banksman", training_name: "Vehicle Banksman" },
    { id: "working_height_awareness", training_name: "Working at Height Awareness" },
    { id: "working_underground_services", training_name: "Working Near Underground Services (HSG47)" },
    { id: "workplace_induction_site", training_name: "Workplace Induction (Site-Specific)" }
  ],
  "Construction - Equipment & Operations": [
    { id: "lifting_operations_awareness", training_name: "Lifting Operations Awareness" },
    { id: "mobile_tower_scaffold", training_name: "Mobile Tower Scaffold (PASMA)" },
    { id: "plant_operator_training", training_name: "Plant Operator Training (CPCS / NPORS)" },
    { id: "temporary_works_supervisor", training_name: "Temporary Works Supervisor" },
    { id: "temporary_works_coordinator", training_name: "Temporary Works Coordinator" },
    { id: "toolbox_talk_attendance", training_name: "Toolbox Talk Attendance" }
  ],
  "Factory/Manufacturing - Safety & Health": [
    { id: "machine_guarding_safety", training_name: "Machine Guarding Safety" },
    { id: "lockout_tagout", training_name: "Lockout/Tagout (LOTO) Training" },
    { id: "chemical_handling_storage", training_name: "Chemical Handling & Storage" },
    { id: "ppe_factory", training_name: "Personal Protective Equipment (PPE)" },
    { id: "noise_exposure_hearing", training_name: "Noise Exposure & Hearing Protection" },
    { id: "ergonomics_repetitive_strain", training_name: "Ergonomics & Repetitive Strain Prevention" },
    { id: "emergency_evacuation_procedures", training_name: "Emergency Evacuation Procedures" },
    { id: "incident_reporting_investigation", training_name: "Incident Reporting & Investigation" },
    { id: "forklift_operation", training_name: "Forklift Operation Certification" },
    { id: "crane_hoist_operation", training_name: "Crane & Hoist Operation" },
    { id: "hot_work_permits", training_name: "Hot Work Permits" },
    { id: "electrical_safety_awareness", training_name: "Electrical Safety Awareness" },
    { id: "slip_trip_fall_prevention", training_name: "Slip, Trip & Fall Prevention" },
    { id: "respiratory_protection", training_name: "Respiratory Protection Training" }
  ],
  "Factory/Manufacturing - Quality & Operations": [
    { id: "good_manufacturing_practice", training_name: "Good Manufacturing Practice (GMP)" },
    { id: "quality_control_procedures", training_name: "Quality Control Procedures" },
    { id: "lean_manufacturing", training_name: "Lean Manufacturing Principles" },
    { id: "5s_workplace_organization", training_name: "5S Workplace Organization" },
    { id: "statistical_process_control", training_name: "Statistical Process Control" },
    { id: "equipment_maintenance", training_name: "Equipment Maintenance Training" },
    { id: "standard_operating_procedures", training_name: "Standard Operating Procedures (SOPs)" },
    { id: "change_control_procedures", training_name: "Change Control Procedures" }
  ],
  "Office Environment - Health & Safety": [
    { id: "dse_assessment", training_name: "Display Screen Equipment (DSE) Assessment" },
    { id: "office_fire_safety", training_name: "Office Fire Safety & Evacuation" },
    { id: "first_aid_office", training_name: "First Aid (Basic/Office)" },
    { id: "manual_handling_office", training_name: "Manual Handling (Office Equipment)" },
    { id: "stress_management_mental_health", training_name: "Stress Management & Mental Health Awareness" },
    { id: "workplace_ergonomics", training_name: "Workplace Ergonomics" }
  ],
  "Office Environment - Professional Development": [
    { id: "data_protection_gdpr", training_name: "Data Protection & GDPR Compliance" },
    { id: "information_security_awareness", training_name: "Information Security Awareness" },
    { id: "cyber_security_training", training_name: "Cyber Security Training" },
    { id: "anti_bribery_corruption", training_name: "Anti-Bribery & Corruption" },
    { id: "equality_diversity_inclusion", training_name: "Equality, Diversity & Inclusion" },
    { id: "customer_service_excellence", training_name: "Customer Service Excellence" },
    { id: "communication_skills", training_name: "Communication Skills" },
    { id: "time_management", training_name: "Time Management" },
    { id: "leadership_development", training_name: "Leadership Development" },
    { id: "performance_management", training_name: "Performance Management" }
  ],
  "Office Environment - Compliance & Legal": [
    { id: "health_safety_managers", training_name: "Health & Safety for Managers" },
    { id: "environmental_awareness", training_name: "Environmental Awareness" },
    { id: "business_continuity_planning", training_name: "Business Continuity Planning" },
    { id: "record_keeping_document_control", training_name: "Record Keeping & Document Control" },
    { id: "whistleblowing_procedures", training_name: "Whistleblowing Procedures" },
    { id: "code_conduct_training", training_name: "Code of Conduct Training" }
  ],
  "Universal Training (All Environments)": [
    { id: "new_employee_orientation", training_name: "New Employee Orientation" },
    { id: "company_policies_procedures", training_name: "Company Policies & Procedures" },
    { id: "emergency_response_training", training_name: "Emergency Response Training" },
    { id: "environmental_management", training_name: "Environmental Management" },
    { id: "sustainability_awareness", training_name: "Sustainability Awareness" },
    { id: "professional_ethics", training_name: "Professional Ethics" },
    { id: "continuous_improvement", training_name: "Continuous Improvement Training" },
    { id: "team_building_collaboration", training_name: "Team Building & Collaboration" },
    { id: "problem_solving_techniques", training_name: "Problem Solving Techniques" },
    { id: "root_cause_analysis", training_name: "Root Cause Analysis" }
  ]
};

// Create a flattened array of all training items for easy searching
export const allTrainingItems: TrainingItem[] = Object.values(trainingItemsByCategory).flat();

// Form step constants
export enum FORM_STEPS {
  STAFF_SELECTION = 1,
  TRAINING_RECORDS = 2,
  CARDS_TICKETS = 3,
  CERTIFICATES = 4
}

export const STEP_LABELS = [
  'Staff Selection',
  'Training Records', 
  'Cards & Tickets',
  'Certificates'
];

export const TOTAL_STEPS = 4;

// Input class name for consistent styling
export const INPUT_CLASS_NAME = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white";

// File upload settings
export const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.jpg,.jpeg,.png";

// Utility function to get training name by ID
export const getTrainingName = (trainingId: string): string => {
  const item = allTrainingItems.find(item => item.id === trainingId);
  return item ? item.training_name : trainingId;
};

// Color classes for expiry status
export const getExpiryColorClass = (expiryDate: string): string => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'text-red-600 dark:text-red-400'; // Past today's date
  } else if (diffDays <= 30) {
    return 'text-orange-800 dark:text-orange-600'; // Within 30 days (dark orange)
  } else if (diffDays <= 60) {
    return 'text-orange-600 dark:text-orange-400'; // Within 60 days (orange)
  }
  return 'text-green-600 dark:text-green-400'; // Future dates (green)
};

// Date formatting utility
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};