import type { HazardIdentificationSections } from '../types';

// Helper function to format hazard identification checkboxes
export const formatHazardIdentification = (hazardId: any): string => {
  if (!hazardId) return '';
  
  const sections: HazardIdentificationSections = {
    workingAtHeight: {
      title: 'Working at height - This includes roof work, any work off a scaffold or out of a MEWP',
      options: {
        fenceOff: 'Fence off underneath the work area',
        isolateHazard: 'Isolate the hazard using methods such as scaffolding, guarded work Platforms, mewps and edge protection',
        useCatchment: 'Use catchment methods such as netting to catch tools and debris',
        equipmentFitForPurpose: 'Working at height equipment must be fit for purpose and in good condition',
        useFallRestraint: 'Fall restraint equipment to be used eg harness'
      }
    },
    scaffolding: {
      title: 'Erecting or dismantling scaffolding (portable or fixed)',
      options: {
        competentInstaller: 'To be installed and tagged by a competent installer',
        regularlyChecked: 'Regularly checked (weekly) as safe for use and current tag is on display',
        fitForPurpose: 'Ensure scaffold is fit for purpose eg correct load rating'
      }
    },
    mewp: {
      title: 'Using a mobile elevated working platform (MEWPs, man-cage, cherry picker)',
      options: {
        certified: 'Ensure equipment is certified and fit for purpose',
        competentPerson: 'Must be operated by a competent person',
        preStartChecks: 'Daily pre-start checks to be done',
        useHarness: 'Use a harness when required'
      }
    },
    demolitionAsbestos: {
      title: 'Demolition Asbestos Survey required carried out by a qualified and competent surveyor',
      options: {
        enclosures: 'Enclosures and negative pressure units are required for Licensed asbestos removal',
        managementPlan: 'An asbestos management plan that identifies all asbestos types and locations must be in place',
        controlPlan: 'An asbestos control plan has been prepared for the work and is attached to this CPP',
        certificates: 'All operatives must hold a certificate for specified class of asbestos work undertaken at the very least an Asbestos Awareness',
        airMonitoring: 'Air monitoring is required for licensed and non licensed asbestos removal control limit is .03 of a fibre per cubic centimetre of air',
        clearanceInspection: 'An independent clearance inspection is required where any asbestos fibres have or may have been released and a re-occupation certificate obtained',
        hseNotification: 'Ensure that HSE is notified at least 14 days prior to any licensed asbestos removal work and an online (HSE) notification of non licensed work must take place prior to work commencing',
        decontamination: 'Ensure site, equipment and ppe is decontaminated or disposed of correctly',
        deenergiseServices: 'Services to be de-energised',
        dampenArea: 'Dampen down or enclose work area to minimise dust',
        wasteDisposal: 'Removal of debris and waste to be disposed of following local council requirements',
        weatherConditions: 'Monitor adverse weather conditions'
      }
    },
    demolitionNoAsbestos: {
      title: 'Conducting any demolition works where asbestos is not present',
      options: {
        deenergiseServices: 'Services to be de-energised',
        dampenArea: 'Dampen down or enclose work area to minimise dust',
        wasteDisposal: 'Removal of debris and waste to be disposed of following local council requirements',
        weatherConditions: 'Monitor adverse weather conditions'
      }
    },
    excavations: {
      title: 'Conducting excavations - This includes any work that may come in contact with overhead/underground utilities',
      options: {
        coverHoles: 'Cover/fence/barricade holes',
        identifyServices: 'All services to be identified before work starts, implement lockout/tagout process to ensure safe isolation',
        useShoring: 'Use shoring for excavations greater than or equal to 1.5m or in unstable ground',
        keepClear: 'Keep other workers/visitors clear and stay visible to operator',
        regularServicing: 'Ensure regular equipment servicing',
        appropriateWeather: 'Dig in appropriate weather conditions',
        dailyInspection: 'Inspect the excavation daily before work starts or after any adverse weather conditions'
      }
    },
    heavyMachinery: {
      title: 'Using heavy machinery or cranes',
      options: {
        turnOffAndLower: 'When not in use ensure all plant, machinery and equipment is turned off and lowered',
        keepClear: 'Keep clear of swing radius',
        lowerBucket: 'Bucket and attachments lowered before approach',
        stayVisible: 'Stay visible to operator',
        regularInspections: 'Regular inspections/servicing, daily pre-starts to be conducted',
        weightLimits: 'Do not exceed weight limits',
        equipmentRegister: 'A plant, machinery and equipment register must be up-to-date and available on site'
      }
    },
    concrete: {
      title: 'Working with concrete',
      options: {
        noWorkAbove: 'Do not work above reinforcing steel',
        capExposed: 'Cap all exposed reinforcing steel',
        eyewashFacilities: 'Eye wash facilities must be available on site',
        regularServicing: 'Ensure regular equipment servicing',
        hazardousRegister: 'Complete a hazardous substance register and attach to this CPP',
        msdsAvailable: 'Ensure Material safety data sheets (msds) are available on site'
      }
    },
    hotWorks: {
      title: 'Carrying out any hot works (welding, brazing)',
      options: {
        clearArea: 'Clear area of all combustible materials',
        secureGasBottles: 'Secure all gas bottles',
        fireExtinguisher: 'Clean water and fire extinguisher must be available at all times',
        permitRequired: 'A permit to work process is required'
      }
    },
    temporarySupports: {
      title: 'Using temporary supports (Acrow props)',
      options: {
        approvedProps: 'Use approved props installed to engineer\'s design',
        goodCondition: 'Ensure props are in good condition'
      }
    },
    handlingGlass: {
      title: 'Handling glass',
      options: {
        keepClear: 'All visitors and other workers to keep clear',
        noWorkUnderneath: 'Do not work underneath where glass is being installed',
        correctDisposal: 'Glass to be disposed of correctly',
        immediateCleanup: 'All broken glass to be cleaned up immediately'
      }
    },
    hazardousSubstances: {
      title: 'Hazardous Substances',
      options: {
        correctStorage: 'Ensure correct storage, handling and disposal',
        licensedHandlers: 'Ensure licensed handlers for prescribed types and quantities',
        coshhAssessment: 'Complete a task specific COSHH assessment and attach to this CPP',
        sdsAvailable: 'Ensure safety data sheets (sds) available on site and are followed'
      }
    },
    crampedConditions: {
      title: 'Working in cramped conditions (underfloor, roof spaces)',
      options: {
        comfortableExit: 'Do not enter areas not large enough to comfortably exit',
        standbyPerson: 'Use a standby person',
        ventilationLighting: 'Ensure sufficient ventilation and lighting'
      }
    },
    confinedSpace: {
      title: 'Conducting any confined space work - A confined space is an enclosed or partially enclosed space, not intended for primary human occupancy. It is generally not a ceiling space or underfloor space (restricted space)',
      options: {
        authorizedOnly: 'Do not enter a confined space unless authorised to do so',
        testingAndPermit: 'Atmospheric testing/monitoring and entry permit in place',
        responseplan: 'High risk response plan to be put in place before works commence'
      }
    }
  };

  const result: string[] = [];
  
  // Iterate through each section in hazardId
  Object.entries(hazardId).forEach(([sectionKey, sectionData]: [string, any]) => {
    // Check if this section is selected
    if (sectionData.selected && sections[sectionKey]) {
      const section = sections[sectionKey];
      const selectedOptions = Object.entries(sectionData)
        .filter(([optKey, value]) => 
          value === true && 
          optKey !== 'selected' && 
          section.options[optKey]
        )
        .map(([optKey, _]) => section.options[optKey]);
      
      if (selectedOptions.length > 0) {
        result.push(`${section.title}\n${selectedOptions.map(opt => `• ${opt}`).join('\n')}`);
      }
    }
  });

  return result.join('\n\n');
};
