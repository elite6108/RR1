// CPP Form Data Types
export interface CPPFormData {
  // Front Cover
  frontCover: {
    projectName: string;
    projectId: string;
    projectReference: string;
    projectLocation: string;
    clientName: string;
    principalContractor: string;
    contractorName: string;
    preparedBy: string;
    preparedDate: string;
    fileName: string;
    version: string;
  };

  // Project Description
  projectDescription: {
    description: string;
    startDate: string;
    duration: string;
    maxWorkers: number;
  };

  // Site Information
  siteInformation: {
    address: {
      line1: string;
      line2?: string;
      town: string;
      county: string;
      postCode: string;
    };
    accessRestrictions: string;
    parkingArrangements: string;
    existingEnvironment: string;
    surroundingLandUse: string;
    existingServices: string[];
  };

  // Hours & Team
  hoursTeam: {
    workingHours: string;
    outOfHoursContact: string;
    keyMembers: Array<{
      id: string;
      name: string;
      role: string;
      contact: string;
    }>;
  };

  // Management of Work
  managementWork: {
    supervisionArrangements: string;
    trainingArrangements: string;
    consultationArrangements: string;
  };

  // Management Structure
  managementStructure: {
    roles: Array<{
      id: string;
      title: string;
      responsibilities: string;
      name: string;
    }>;
  };

  // Site Rules
  siteRules: {
    generalRules: string[];
    ppeRequirements: string[];
    otherPPE?: string;
    permitToWork: string[];
    trafficManagement: string;
  };

  // Arrangements
  arrangements: {
    deliveries: string;
    storage: string;
    security: string;
    electricity: string;
    lighting: string;
  };

  // Site Induction
  siteInduction: {
    inductionTopics: string[];
    inductionProcess: string;
    recordKeeping: string;
  };

  // Welfare Arrangements
  welfareArrangements: {
    toilets: string;
    restAreas: string;
    dryingRooms: string;
    drinking: string;
    handwashing: string;
  };

  // First Aid Arrangements
  firstAidArrangements: {
    firstAiders: Array<{
      id: string;
      name: string;
      contact: string;
      certification: string;
    }>;
    equipment: string[];
    procedures: string;
  };

  // Rescue Plan
  rescuePlan: {
    emergencyProcedures: string;
    assemblyPoints: string[];
    contactNumbers: Array<{
      id: string;
      name: string;
      number: string;
      purpose: string;
    }>;
  };

  // Specific Measures
  specificMeasures: {
    covid19: string;
    noiseVibration: string;
    dustControl: string;
    wasteManagement: string;
    environmentalProtection: string;
  };

  // Hazards
  hazards: Array<{
    id: string;
    description: string;
    riskLevel: 'low' | 'medium' | 'high';
    controlMeasures: string[];
  }>;

  // High Risk Construction Work
  highRiskWork: {
    activities: Array<{
      id: string;
      type: string;
      description: string;
      controls: string[];
    }>;
  };

  // Notifiable Work
  notifiableWork: {
    isNotifiable: boolean;
    f10Reference?: string;
    submissionDate?: string;
    details?: string;
  };

  // Contractors
  contractors: Array<{
    id: string;
    name: string;
    trade: string;
    contact: string;
    startDate: string;
    duration: string;
  }>;

  // Monitoring & Review
  monitoring: {
    inspectionSchedule: string;
    reviewProcess: string;
    responsiblePerson: string;
    recordKeeping: string;
  };

  // Health & Safety File
  hsFile: {
    arrangements: string;
    information: string;
    format: string;
    handover: string;
  };

  // Hazard Identification
  hazardIdentification: {
    workingAtHeight: {
      selected: boolean;
      fenceOff: boolean;
      isolateHazard: boolean;
      useCatchment: boolean;
      equipmentFitForPurpose: boolean;
      useFallRestraint: boolean;
    };
    scaffolding: {
      selected: boolean;
      competentInstaller: boolean;
      regularlyChecked: boolean;
      fitForPurpose: boolean;
    };
    mewp: {
      selected: boolean;
      certified: boolean;
      competentPerson: boolean;
      preStartChecks: boolean;
      useHarness: boolean;
    };
    demolitionAsbestos: {
      selected: boolean;
      enclosures: boolean;
      managementPlan: boolean;
      controlPlan: boolean;
      certificates: boolean;
      airMonitoring: boolean;
      clearanceInspection: boolean;
      hseNotification: boolean;
      decontamination: boolean;
      deenergiseServices: boolean;
      dampenArea: boolean;
      wasteDisposal: boolean;
      weatherConditions: boolean;
    };
    demolitionNoAsbestos: {
      selected: boolean;
      deenergiseServices: boolean;
      dampenArea: boolean;
      wasteDisposal: boolean;
      weatherConditions: boolean;
    };
    excavations: {
      selected: boolean;
      coverHoles: boolean;
      identifyServices: boolean;
      useShoring: boolean;
      keepClear: boolean;
      regularServicing: boolean;
      appropriateWeather: boolean;
      dailyInspection: boolean;
    };
    heavyMachinery: {
      selected: boolean;
      turnOffAndLower: boolean;
      keepClear: boolean;
      lowerBucket: boolean;
      stayVisible: boolean;
      regularInspections: boolean;
      weightLimits: boolean;
      equipmentRegister: boolean;
    };
    concrete: {
      selected: boolean;
      noWorkAbove: boolean;
      capExposed: boolean;
      eyewashFacilities: boolean;
      regularServicing: boolean;
      hazardousRegister: boolean;
      msdsAvailable: boolean;
    };
    hotWorks: {
      selected: boolean;
      clearArea: boolean;
      secureGasBottles: boolean;
      fireExtinguisher: boolean;
      permitRequired: boolean;
    };
    temporarySupports: {
      selected: boolean;
      approvedProps: boolean;
      goodCondition: boolean;
    };
    handlingGlass: {
      selected: boolean;
      keepClear: boolean;
      noWorkUnderneath: boolean;
      correctDisposal: boolean;
      immediateCleanup: boolean;
    };
    hazardousSubstances: {
      selected: boolean;
      correctStorage: boolean;
      licensedHandlers: boolean;
      coshhAssessment: boolean;
      sdsAvailable: boolean;
    };
    crampedConditions: {
      selected: boolean;
      comfortableExit: boolean;
      standbyPerson: boolean;
      ventilationLighting: boolean;
    };
    confinedSpace: {
      selected: boolean;
      authorizedOnly: boolean;
      testingAndPermit: boolean;
      responseplan: boolean;
    };
  };
}

export type CPPStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export interface CPPValidationError {
  step: CPPStepNumber;
  message: string;
}