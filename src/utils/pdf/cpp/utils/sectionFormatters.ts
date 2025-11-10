import type { 
  ContactNumber, 
  ContractorData,
  SpecificMeasureItem,
  ArrangementItem,
  ContactMember,
  RoleData
} from '../types';
import { formatAddress } from './basicFormatters';
import { formatHazardIdentification } from './hazardFormatters';

// Specialized content formatters for different sections
export const formatSectionContent = (content: any, sectionTitle: string): string => {
  if (!content) return '';

  // Special case for Front Cover
  if (sectionTitle === 'Front Cover') {
    const labels = {
      version: 'Version',
      fileName: 'File Name',
      projectId: 'Project ID',
      clientName: 'Client Name',
      preparedBy: 'Prepared By',
      projectName: 'Project Name',
      preparedDate: 'Prepared Date',
      contractorName: 'Contractor Name',
      projectLocation: 'Project Location',
      projectReference: 'Project Reference',
      principalContractor: 'Principal Contractor'
    };
    return Object.entries(content)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${labels[key as keyof typeof labels]}: ${value}`)
      .join('\n\n');
  }

  // Special case for Site Information
  if (sectionTitle === 'Site Information') {
    const fieldLabels = {
      address: 'Site Address:',
      principalContractorCompany: 'Principal Contractor Company:',
      principalContractor: 'Principal Contractor:',
      principalContractorPhone: 'Principal Contractor Phone:',
      principalContractorEmail: 'Principal Contractor Email:',
      principalDesignerCompany: 'Principal Designer Company:',
      principalDesigner: 'Principal Designer:',
      principalDesignerPhone: 'Principal Designer Phone:',
      principalDesignerEmail: 'Principal Designer Email:',
      siteManager: 'Site Manager:',
      siteManagerPhone: 'Site Manager Phone:',
      siteManagerEmail: 'Site Manager Email:'
    };

    const orderedFields = [
      'address',
      'principalContractorCompany',
      'principalContractor',
      'principalContractorPhone',
      'principalContractorEmail',
      'principalDesignerCompany',
      'principalDesigner',
      'principalDesignerPhone',
      'principalDesignerEmail',
      'siteManager',
      'siteManagerPhone',
      'siteManagerEmail'
    ];

    return orderedFields
      .map(field => {
        let value = content[field];
        if (field === 'address') {
          value = formatAddress(content.address);
        }
        if (value === null || value === undefined || value === '') return '';
        return `${fieldLabels[field as keyof typeof fieldLabels]}\n${value}`;
      })
      .filter(text => text)
      .join('\n\n');
  }

  // Special case for Site Induction
  if (sectionTitle === 'Site Induction') {
    const fieldLabels = {
      arrangements: 'What are the arrangements for site induction?',
      inductionTopics: 'What topics will be covered in the site induction?',
      inductionProcess: 'What is the induction process?',
      recordKeeping: 'How will induction records be kept?'
    };

    const parts: string[] = [];
    if (content.arrangements) {
      parts.push(`${fieldLabels.arrangements}\n${content.arrangements}`);
    }
    if (content.inductionTopics?.length) {
      parts.push(`${fieldLabels.inductionTopics}`);
      content.inductionTopics.forEach((topic: string) => parts.push(`  • ${topic}`));
    }
    if (content.inductionProcess) {
      parts.push(`${fieldLabels.inductionProcess}\n${content.inductionProcess}`);
    }
    if (content.recordKeeping) {
      parts.push(`${fieldLabels.recordKeeping}\n${content.recordKeeping}`);
    }
    return parts.join('\n\n');
  }

  // Special case for First Aid Arrangements
  if (sectionTitle === 'First Aid Arrangements') {
    const fieldLabels = {
      arrangements: 'What are the first aid arrangements for this site?',
      safetyManagerName: 'Safety Manager Name:',
      safetyManagerPhone: 'Safety Manager Phone:',
      firstAiderName: 'Trained First Aider Name:',
      firstAiderPhone: 'Trained First Aider Phone:',
      firstAidKitLocation: 'First Aid Kit Location:',
      fireEquipmentLocation: 'Fire Fighting Equipment Location:',
      emergencySignal: 'Emergency Signal:',
      assemblyArea: 'Emergency Area:',
      nearestMedical: 'Nearest A&E or Medical Centre:'
    };

    const orderedFields = [
      'arrangements',
      'safetyManagerName',
      'safetyManagerPhone',
      'firstAiderName',
      'firstAiderPhone',
      'firstAidKitLocation',
      'fireEquipmentLocation',
      'emergencySignal',
      'assemblyArea',
      'nearestMedical'
    ];

    return orderedFields
      .map(field => {
        const value = content[field];
        if (value === null || value === undefined || value === '') return '';
        return `${fieldLabels[field as keyof typeof fieldLabels]}\n${value}`;
      })
      .filter(text => text)
      .join('\n\n');
  }

  // Special case for Rescue Plan
  if (sectionTitle === 'Rescue Plan') {
    const parts: string[] = [];
    const mainQuestion = 'What are the rescue plan arrangements for this site?';
    
    if (content.arrangements) {
      parts.push(`${mainQuestion}\n${content.arrangements}`);
    }
    if (content.emergencyProcedures) {
      parts.push(`Emergency Procedures:\n${content.emergencyProcedures}`);
    }
    if (content.assemblyPoints?.length) {
      parts.push('Assembly Points:');
      content.assemblyPoints.forEach((point: string) => parts.push(`  • ${point}`));
    }
    if (content.contactNumbers?.length) {
      parts.push('Emergency Contact Numbers:');
      content.contactNumbers.forEach((contact: ContactNumber) => {
        parts.push(`  • ${contact.name}: ${contact.number} (${contact.purpose})`);
      });
    }
    return parts.join('\n\n');
  }

  // Special case for Specific Measures
  if (sectionTitle === 'Specific Measures') {
    const parts: string[] = [];
    if (content.items?.length) {
      content.items.forEach((item: SpecificMeasureItem) => {
        parts.push(`Code: ${item.code}`);
        parts.push(`Category: ${item.category}`);
        parts.push(`Title: ${item.title}`);
        parts.push(`Description: ${item.description}`);
        parts.push(`Control Measures: ${item.controlMeasure}\n`);
      });
    }
    return parts.join('\n');
  }

  // Special case for High Risk Construction Work
  if (sectionTitle === 'High Risk Construction Work') {
    const mainQuestion = 'The following is the list of high risk construction work (HRCW) that require a Risk Assessment Method Statement (RAMS) to be prepared, submitted and reviewed prior to work beginning. Select which work applies to the site:';
    
    const hrcwOptions = {
      option1: 'Work which puts workers at risk of burial under earthfalls, engulfment in swampland or falling from a height, where the risk is particularly aggravated by the nature of the work or processes used or by the environment at the place of work or site',
      option2: 'Work which puts workers at risk from chemical or biological substances constituting a particular danger to the health or safety of workers or involving a legal requirement for health monitoring',
      option3: 'Work with ionizing radiation requiring the designation of controlled or supervised areas under regulation 16 of the Ionising Radiations Regulations 1999(17)',
      option4: 'Work near high voltage power lines',
      option5: 'Work exposing workers to the risk of drowning',
      option6: 'Work on wells, underground earthworks and tunnels',
      option7: 'Work carried out by divers having a system of air supply',
      option8: 'Work carried out by workers in caissons with a compressed air atmosphere',
      option9: 'Work involving the use of explosives',
      option10: 'Work involving the assembly or dismantling of heavy prefabricated components',
      option11: 'Work involving entry to confined spaces'
    };

    let optionsList = '• No high risk construction work selected';
    
    if (Array.isArray(content.selectedOptions) && content.selectedOptions.length > 0) {
      optionsList = content.selectedOptions
        .map((optionKey: string) => {
          const optionText = hrcwOptions[optionKey as keyof typeof hrcwOptions];
          if (optionText) {
            return `• ${optionText}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');
    }
    
    return `${mainQuestion}|${optionsList}`;
  }

  // Special case for Notifiable Work
  if (sectionTitle === 'Notifiable Work') {
    const mainQuestion = 'Select the Notifiable Work that will take place on your site:';
    
    const notifiableOptions = {
      option1: 'The project will last more than 30 days, and more than 20 workers working simultaneously on site at any point during the project',
      option2: 'The project will exceed 500 person days',
      option3: 'Licenced Asbestos Work',
      option4: 'Non-licenced Asbestos Work'
    };

    const parts = [];
    
    if (Array.isArray(content.selectedOptions)) {
      const optionsList = content.selectedOptions
        .map((optionKey: string) => {
          const optionText = notifiableOptions[optionKey as keyof typeof notifiableOptions];
          if (optionText) {
            return `• ${optionText}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');
      parts.push(`${mainQuestion}\n${optionsList || '• No notifiable work selected'}`);
    } else {
      parts.push(`${mainQuestion}\n• No notifiable work selected`);
    }
    
    return parts.join('\n\n');
  }

  // Special case for Hazard Identification
  if (sectionTitle === 'Hazard Identification') {
    return formatHazardIdentification(content);
  }

  // Special case for Monitoring & Review section
  if (sectionTitle === 'Monitoring & Review') {
    const fieldLabels = {
      riskArrangements: 'What are the arrangements for monitoring and reviewing the effectiveness of the plan for addressing risk?',
      cooperation: 'How does the PC co-operate with the contractors to ensure the plan remains fit for purpose through the construction phase?',
      siteReviewFrequency: 'How often will you conduct site reviews on this job?',
      toolboxTalkFrequency: 'How often will you conduct workplace toolbox talks on this job?'
    };

    const orderedEntries = [
      ['riskArrangements', content.riskArrangements],
      ['cooperation', content.cooperation],
      ['siteReviewFrequency', content.siteReviewFrequency],
      ['toolboxTalkFrequency', content.toolboxTalkFrequency]
    ];

    return orderedEntries
      .map(([key, value]) => {
        if (value === null || value === undefined || value === '') return '';
        const label = fieldLabels[key as keyof typeof fieldLabels];
        return `${label}\n${value}`;
      })
      .filter(text => text)
      .join('\n\n');
  }

  // Special case for Project Description
  if (sectionTitle === 'Project Description') {
    const fieldLabels = {
      workType: 'What type of work will be carried out?',
      startDate: 'When will the work start?',
      endDate: 'When will the work end?',
      description: 'Please provide a description of the work:',
      orderReference: 'What is the order reference?'
    };

    const orderedFields = [
      'workType',
      'startDate',
      'endDate',
      'description',
      'orderReference'
    ];

    return orderedFields
      .map(field => {
        const value = content[field];
        if (value === null || value === undefined || value === '') return '';
        return `${fieldLabels[field as keyof typeof fieldLabels]}\n${value}`;
      })
      .filter(text => text)
      .join('\n\n');
  }

  // Special case for Hours & Team
  if (sectionTitle === 'Hours & Team') {
    const parts: string[] = [];
    const fieldLabels = {
      workingDays: 'What days will work be carried out?',
      hours: 'What are the working hours?',
      keyMembers: 'Who are the key team members?'
    };

    if (content.workingDays?.length) {
      parts.push(`${fieldLabels.workingDays}\n${content.workingDays.join(', ')}`);
    }
    if (content.hours) {
      parts.push(`${fieldLabels.hours}\n${content.hours}`);
    }
    if (content.keyMembers?.length) {
      const membersList = content.keyMembers.map((member: ContactMember) => {
        if (member.name && member.role) {
          return `• ${member.name} - ${member.role}${member.contact ? ` (${member.contact})` : ''}`;
        }
        return '';
      }).filter(Boolean).join('\n');
      parts.push(`${fieldLabels.keyMembers}\n${membersList}`);
    }
    return parts.join('\n\n');
  }

  // Special case for Management of Work
  if (sectionTitle === 'Management of Work') {
    const parts: string[] = [];
    
    if (content.healthAndSafetyAims) {
      parts.push(`What are the Health and Safety aims of this project?\n${content.healthAndSafetyAims}`);
    }
    if (content.supervisionArrangements) {
      parts.push(`Supervision Arrangements:\n${content.supervisionArrangements}`);
    }
    if (content.trainingArrangements) {
      parts.push(`Training Arrangements:\n${content.trainingArrangements}`);
    }
    if (content.consultationArrangements) {
      parts.push(`Consultation Arrangements:\n${content.consultationArrangements}`);
    }
    return parts.join('\n\n');
  }

  // Special case for Management Structure
  if (sectionTitle === 'Management Structure' && content.roles) {
    const parts: string[] = [];
    content.roles.forEach((role: RoleData) => {
      parts.push(`Role: ${role.role}`);
      parts.push(`Name: ${role.name}`);
      parts.push(`Contact Number: ${role.contact}\n`);
    });
    return parts.join('\n');
  }

  // Special case for Site Rules
  if (sectionTitle === 'Site Rules') {
    const parts: string[] = [];
    
    if (content.ppeRequirements?.length) {
      const ppeList = content.ppeRequirements.map((ppe: string) => `• ${ppe}`).join('\n');
      parts.push(`PPE Requirements:\n${ppeList}`);
    }
    if (content.otherPPE) {
      parts.push(`Other PPE Required:\n${content.otherPPE}`);
    }
    if (content.generalRules?.length) {
      const rulesList = content.generalRules.map((rule: string) => `• ${rule}`).join('\n');
      parts.push(`Additional/General Rules:\n${rulesList}`);
    }
    return parts.join('\n\n');
  }

  // Special case for Arrangements
  if (sectionTitle === 'Arrangements') {
    const parts: string[] = [];
    if (content.items?.length) {
      content.items.forEach((item: ArrangementItem) => {
        parts.push(`Arrangement: ${item.type}`);
        parts.push(`Arrangement Cover: ${item.cover}\n`);
      });
    }
    return parts.join('\n');
  }

  // Special case for Welfare Arrangements
  if (sectionTitle === 'Welfare Arrangements') {
    const parts: string[] = [];
    const welfareOptions = {
      option1: 'Groundhog/Oasis Integrated Welfare Unit',
      option2: 'Mobile Welfare Unit',
      option3: 'Portaloo WC Facilities',
      option4: 'Welfare and Office units, containing, WC closets (Male & Female), hand washing, hot and cold water, drying room, canteen/break out room, means to heat food'
    };

    if (Array.isArray(content.selectedOptions)) {
      const optionsList = content.selectedOptions
        .map((optionKey: string) => {
          const optionText = welfareOptions[optionKey as keyof typeof welfareOptions];
          if (optionText) {
            return `• ${optionText}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n');
      parts.push(`Selected Welfare Arrangements:\n${optionsList}`);
    }

    if (content.other) parts.push(`Other Arrangements:\n${content.other}`);
    if (content.toilets) parts.push(`Toilets:\n${content.toilets}`);
    if (content.restAreas) parts.push(`Rest Areas:\n${content.restAreas}`);
    if (content.dryingRooms) parts.push(`Drying Rooms:\n${content.dryingRooms}`);
    if (content.drinking) parts.push(`Drinking Water:\n${content.drinking}`);
    if (content.handwashing) parts.push(`Hand Washing:\n${content.handwashing}`);
    
    return parts.filter(p => p).join('\n\n');
  }

  // Special case for Contractors
  if (sectionTitle === 'Contractors') {
    console.log('Contractors section data:', content); // Debug log
    const parts: string[] = [];
    if (Array.isArray(content)) {
      content.forEach((contractor: ContractorData) => {
        if (!contractor) return;
        
        const details = [
          `Company Name: ${contractor.companyName || ''}`,
          `Trade: ${contractor.trade || ''}`,
          `First Name: ${contractor.firstName || ''}`,
          `Last Name: ${contractor.lastName || ''}`,
          `Phone: ${contractor.phone || ''}`,
          `Email: ${contractor.email || ''}`
        ].filter(detail => !detail.endsWith(': '));
        
        if (details.length > 0) {
          parts.push(details.join('\n'));
        }
      });
    }
    const result = parts.join('\n\n') || 'No contractors listed';
    console.log('Formatted contractors result:', result); // Debug log
    return result;
  }

  // Default handling for other content
  if (typeof content === 'string') return content;
  
  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'string') return item;
      return Object.values(item).join(': ');
    }).join('\n');
  }
  
  return Object.entries(content)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      
      if (Array.isArray(value)) {
        return `${formattedKey}:\n${value.map(item => `  • ${item}`).join('\n')}`;
      }
      if (typeof value === 'object' && value !== null) {
        return `${formattedKey}:\n${Object.entries(value)
          .map(([subKey, subValue]) => {
            const formattedSubKey = subKey
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim();
            return `  ${formattedSubKey}: ${subValue}`;
          })
          .join('\n')}`;
      }
      return `${formattedKey}: ${value}`;
    })
    .join('\n\n');
};
