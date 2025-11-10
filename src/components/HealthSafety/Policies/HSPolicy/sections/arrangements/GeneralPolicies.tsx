import React from 'react';

interface GeneralPoliciesProps {
  onSectionSelect: (section: string) => void;
  selectedSection: string | null;
}

export const GENERAL_POLICIES_SECTIONS = {
  title: 'General Company Policies and Procedures',
  sections: [
    'Accident and Reporting Policy',
    'Alcohol & Drugs Policy',
    'Fire Policy',
    'First Aid Policy',
    'Driving for Work Policy',
    'Young Persons Policy',
    'Safety Improvement Scheme',
    'Environmental Policy',
    'Equal Opportunity Policy',
    'Risk Assessment Policy',
    'Corporate Manslaughter/Homicide Act Policy',
    'Work Safe Policy',
    'Slavery & Human Trafficking Policy',
    'Health Surveillance Policy',
    'Protective Clothing & Equipment Policy',
    'Additional'
  ]
};

export function GeneralPolicies({ onSectionSelect, selectedSection }: GeneralPoliciesProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{GENERAL_POLICIES_SECTIONS.title}</h4>
      <div className="space-y-1 ml-4">
        {GENERAL_POLICIES_SECTIONS.sections.map((section) => (
          <button
            key={section}
            onClick={() => onSectionSelect(section)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors text-left ${
              selectedSection === section
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-medium'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-600/50'
            }`}
          >
            <span className="text-left">{section}</span>
            <svg
              className={`h-4 w-4 flex-shrink-0 ${
                selectedSection === section 
                  ? 'text-green-500 dark:text-green-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}