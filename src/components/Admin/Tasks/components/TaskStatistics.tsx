import React from 'react';
import { Task } from '../types';
import { Check, FileText, Clock, AlertTriangle, Star } from 'lucide-react';
import SpotlightCard from '../../../../styles/spotlight/SpotlightCard';

interface TaskStatisticsProps {
  tasks: Task[];
}

export const TaskStatistics: React.FC<TaskStatisticsProps> = ({ tasks }) => {
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress').length;
  const overdueTasks = tasks.filter((task) => task.status === 'over_due').length;
  const highPriorityTasks = tasks.filter((task) => task.priority === 'high' || task.priority === 'critical').length;

  const totalCost = tasks.reduce((sum, task) => sum + (task.cost || 0), 0);
  const averageCost = tasks.length > 0 ? totalCost / tasks.length : 0;

  return (
    <div className="mt-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Total Tasks Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(251, 113, 133, 0.4)"
          darkSpotlightColor="rgba(251, 113, 133, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Total Tasks
              </h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              {tasks.length}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#e84943' }} />
          </div>
        </SpotlightCard>

        {/* Completed Tasks Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(34, 197, 94, 0.4)"
          darkSpotlightColor="rgba(34, 197, 94, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Completed
              </h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              {completedTasks}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#F0FDF4" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#22c55e' }} />
          </div>
        </SpotlightCard>

        {/* In Progress Tasks Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(59, 130, 246, 0.4)"
          darkSpotlightColor="rgba(59, 130, 246, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                In Progress
              </h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              {inProgressTasks}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#EBF8FF" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Clock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#3b82f6' }} />
          </div>
        </SpotlightCard>

        {/* High Priority Tasks Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(251, 146, 60, 0.4)"
          darkSpotlightColor="rgba(251, 146, 60, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                High Priority
              </h3>
            </div>
            <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
              {highPriorityTasks}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FEF3C7" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <Star className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#fb923c' }} />
          </div>
        </SpotlightCard>

        {/* Overdue Tasks Widget */}
        <SpotlightCard
          isDarkMode={document.documentElement.classList.contains('dark')}
          spotlightColor="rgba(239, 68, 68, 0.4)"
          darkSpotlightColor="rgba(239, 68, 68, 0.2)"
          size={400}
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-lg p-6 overflow-hidden relative border border-red-200 dark:border-red-800"
        >
          <div className="relative z-10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                Overdue Tasks
              </h3>
            </div>
            <div className="text-lg font-medium text-red-600 dark:text-red-400 text-left">
              {overdueTasks}
            </div>
          </div>
          <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <AlertTriangle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#dc2626' }} />
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
