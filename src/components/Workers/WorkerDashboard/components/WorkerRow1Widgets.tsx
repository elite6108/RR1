import React from 'react';
import { Calendar } from 'lucide-react';
import { WorkerUser } from '../types/workerDashboardTypes';
import { isHealthQuestionnaireNeeded, hasValidHealthQuestionnaire } from '../utils/dashboardUtils';

interface WorkerRow1WidgetsProps {
  user: WorkerUser | null;
  handleMyProfile: () => void;
  handleHealthQuestionnaire: () => void;
  handleEditHealthQuestionnaire: () => void;
  handleStartQRScan: () => void;
  handleAnnualLeave: () => void;
}

export function WorkerRow1Widgets({
  user,
  handleMyProfile,
  handleHealthQuestionnaire,
  handleEditHealthQuestionnaire,
  handleStartQRScan,
  handleAnnualLeave
}: WorkerRow1WidgetsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* My Profile Widget */}
      <div 
        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer"
        onClick={handleMyProfile}
      >
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
        <div className="relative z-10">
          <button className="w-full h-full text-left">
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">01</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">My Profile</h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                View and update your personal information
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" aria-hidden="true" style={{color: 'rgb(165, 167, 252)'}}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Health Questionnaire Widget */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
        <div className="relative z-10">
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">02</p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">Health Questionnaire</h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left mb-4">
              {!isHealthQuestionnaireNeeded(user)
                ? 'Already completed (valid for 6 months)'
                : 'Complete your 6-month health assessment'}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {isHealthQuestionnaireNeeded(user) ? (
                <button
                  onClick={handleHealthQuestionnaire}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors text-sm font-medium"
                >
                  Start Questionnaire
                </button>
              ) : (
                <button
                  onClick={handleEditHealthQuestionnaire}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Edit Questionnaire
                </button>
              )}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
              </svg>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8"
              aria-hidden="true"
              style={{color: 'rgb(165, 167, 252)'}}
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Scan QR Code Widget */}
      <div
        className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${
          !hasValidHealthQuestionnaire(user)
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        }`}
        onClick={
          hasValidHealthQuestionnaire(user) ? handleStartQRScan : undefined
        }
      >
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
        <div className="relative z-10">
          <button className="w-full h-full text-left">
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">03</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">Scan QR Code</h3>
              </div>
              <div className={`text-lg font-medium text-left ${
                !hasValidHealthQuestionnaire(user)
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {!hasValidHealthQuestionnaire(user)
                  ? 'Complete Health Questionnaire first'
                  : 'Scan a site QR code to check in or out'}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
                </svg>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8"
                aria-hidden="true"
                style={{color: 'rgb(165, 167, 252)'}}
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Annual Leave Widget */}
      <div 
        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer"
        onClick={handleAnnualLeave}
      >
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
        <div className="relative z-10">
          <button className="w-full h-full text-left">
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">04</p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">Annual Leave</h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                Request and manage your annual leave
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
                </svg>
              </div>
              <Calendar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" 
                aria-hidden="true" 
                style={{color: 'rgb(165, 167, 252)'}} 
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}