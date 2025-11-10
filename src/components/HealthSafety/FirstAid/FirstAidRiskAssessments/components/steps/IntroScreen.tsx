import React from 'react';
import { AlertTriangle, CheckCircle, Users, MapPin, Clock, Shield } from 'lucide-react';

interface IntroScreenProps {
  onContinue: () => void;
}

export function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Competence Requirements Section */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
              Competence Requirements
            </h3>
            <div className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
              <p>
                Persons who undertake a First Aid Needs Assessment must have a level of competence and knowledge of the buildings/premises, staff demographic, likely hazards, and working arrangements within their department.
              </p>
              <p className="font-medium">
                It is the responsibility of the Premises Responsible Person to ensure that staff conducting such an assessment is competent to do so.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Considerations Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              In assessing your first aid needs, you should consider:
            </h3>
            <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <li className="flex items-start space-x-3">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>the nature of the work you do</span>
              </li>
              <li className="flex items-start space-x-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>workplace hazards and risks (including specific hazards requiring special arrangements)</span>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>the nature and size of your workforce</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>the work patterns of your staff</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>holiday and other absences of those who will be first aiders</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>your organisation's history of accidents</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Considerations Section */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              You may also need to consider:
            </h3>
            <ul className="space-y-3 text-sm text-green-700 dark:text-green-300">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>the needs of travelling, remote and lone workers</span>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>the distribution of your workforce</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>the remoteness of any of your sites from emergency medical services</span>
              </li>
              <li className="flex items-start space-x-3">
                <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>whether your employees work on shared or multi-occupancy sites</span>
              </li>
              <li className="flex items-start space-x-3">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>first aid provision for non-employees (eg members of the public)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Begin Assessment
        </button>
      </div>
    </div>
  );
}
