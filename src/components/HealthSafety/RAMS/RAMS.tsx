import React, { useState } from 'react';
import { ArrowRight, FileText, ClipboardList } from 'lucide-react';
import { RAMSsubpage } from './RAMSsubpage';
import { RiskAssessmentsubpage } from '../RiskAssessments/RiskAssessmentsubpage';

interface RAMSProps {
  onBack: () => void;
}

export function RAMS({ onBack }: RAMSProps) {
  const [showRAMSsubpage, setShowRAMSsubpage] = useState(false);
  const [showRiskAssessmentsubpage, setShowRiskAssessmentsubpage] =
    useState(false);

  if (showRAMSsubpage) {
    return <RAMSsubpage onBack={() => setShowRAMSsubpage(false)} />;
  }

  if (showRiskAssessmentsubpage) {
    return (
      <RiskAssessmentsubpage
        onBack={() => setShowRiskAssessmentsubpage(false)}
      />
    );
  }

  return (
    <>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
      >
        <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RAMS Widget */}
        <button
          onClick={() => setShowRAMSsubpage(true)}
          className="bg-white shadow rounded-lg p-6 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">RAMS</h3>
              <p className="mt-1 text-sm text-gray-500">
                Risk Assessment Method Statements
              </p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </button>

        {/* Risk Assessments Widget */}
        <button
          onClick={() => setShowRiskAssessmentsubpage(true)}
          className="bg-white shadow rounded-lg p-6 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Risk Assessments
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                View and manage risk assessments
              </p>
            </div>
            <ClipboardList className="h-8 w-8 text-gray-400" />
          </div>
        </button>
      </div>
    </>
  );
}
