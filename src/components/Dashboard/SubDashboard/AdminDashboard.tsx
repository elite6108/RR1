import React from 'react';
import { ArrowRight, Users2, ListTodo, Calendar as CalendarIcon, Briefcase, FileText, ClipboardList, ChevronLeft } from 'lucide-react';
import SpotlightCard from '../../../styles/spotlight/SpotlightCard';

interface AdminDashboardProps {
  onBack: () => void;
  setShowStaff: (show: boolean) => void;
  setShowTasks: (show: boolean) => void;
  setShowCalendar: (show: boolean) => void;
  setShowSubcontractors: (show: boolean) => void;
  setShowFiles: (show: boolean) => void;  
  setShowHolidays: (show: boolean) => void;
  setShowToDo: (show: boolean) => void;
  totalStaff: number;
  totalTasks: number;
  totalSubcontractors: number;
}

export function AdminDashboard({ 
  onBack, 
  setShowStaff, 
  setShowTasks, 
  setShowCalendar, 
  setShowSubcontractors,
  setShowFiles,
  setShowHolidays,
  setShowToDo,
  totalStaff,
  totalTasks,
  totalSubcontractors
}: AdminDashboardProps) {
  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div>
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Company
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowStaff(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  01
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Staff
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {totalStaff}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <Users2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
            </div>
          </button>
        </SpotlightCard>

        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowTasks(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  02
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Company Tasks
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {totalTasks}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <ListTodo className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
            </div>
          </button>
        </SpotlightCard>

        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowToDo(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  03
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  My To Do List
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <ClipboardList className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
            </div>
          </button>
        </SpotlightCard>

        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowCalendar(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  04
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Calendar
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
            </div>
          </button>
        </SpotlightCard>

        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowSubcontractors(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  05
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Sub Contractors
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {totalSubcontractors}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <Briefcase className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
            </div>
          </button>
        </SpotlightCard>

        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowFiles(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  06
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Files
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
            </div>
          </button>
        </SpotlightCard>

        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(165, 243, 252, 0.4)"
          darkSpotlightColor="rgba(165, 243, 252, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowHolidays(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  07
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  Holidays
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: 'rgb(165 167 252)' }} />
            </div>
          </button>
        </SpotlightCard>
      </div>
    </div>
  );
}
