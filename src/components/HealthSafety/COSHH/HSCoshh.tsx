import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, ChevronLeft, FileCheck } from 'lucide-react';
import SpotlightCard from '../../../styles/spotlight/SpotlightCard';
import { CoshhRegister } from './Register';
import { CoshhAssessments } from './Assessments';
import { MSDSSafetySheets } from './SafetySheets';
import { supabase } from '../../../lib/supabase';

interface HSCoshhProps {
  onBack: () => void;
}

export function HSCoshh({ onBack }: HSCoshhProps) {
  const [showRegister, setShowRegister] = useState(false);
  const [showAssessments, setShowAssessments] = useState(false);
  const [showMSDSSheets, setShowMSDSSheets] = useState(false);
  
  // State for counts
  const [registerCount, setRegisterCount] = useState(0);
  const [assessmentsCount, setAssessmentsCount] = useState(0);
  const [msdsSheetsCount, setMsdsSheetsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Detect dark mode from document class
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Fetch counts on component mount
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);

      // Fetch COSHH register count
      const { count: registerCountResult, error: registerError } = await supabase
        .from('coshh_register')
        .select('*', { count: 'exact', head: true });

      if (registerError) throw registerError;
      setRegisterCount(registerCountResult || 0);

      // Fetch COSHH assessments count
      const { count: assessmentsCountResult, error: assessmentsError } = await supabase
        .from('coshh_assessments')
        .select('*', { count: 'exact', head: true });

      if (assessmentsError) throw assessmentsError;
      setAssessmentsCount(assessmentsCountResult || 0);

      // Fetch COSHH MSDS sheets count
      const { count: msdsSheetsCountResult, error: msdsError } = await supabase
        .from('coshh_msds')
        .select('*', { count: 'exact', head: true });

      if (msdsError) throw msdsError;
      setMsdsSheetsCount(msdsSheetsCountResult || 0);

    } catch (error) {
      console.error('Error fetching counts:', error);
      // Set fallback values on error
      setRegisterCount(0);
      setAssessmentsCount(0);
      setMsdsSheetsCount(0);
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <CoshhRegister onBack={() => setShowRegister(false)} />;
  }

  if (showAssessments) {
    return <CoshhAssessments onBack={() => setShowAssessments(false)} />;
  }

  if (showMSDSSheets) {
    return <MSDSSafetySheets onBack={() => setShowMSDSSheets(false)} />;
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Health & Safety
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        COSHH Management
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* COSHH Register Widget */}
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(255, 214, 92, 0.4)"
          darkSpotlightColor="rgba(255, 214, 92, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowRegister(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  01
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  COSHH Register
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {loading ? '...' : registerCount}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </button>
        </SpotlightCard>

        {/* COSHH Assessments Widget */}
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(255, 214, 92, 0.4)"
          darkSpotlightColor="rgba(255, 214, 92, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowAssessments(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  02
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  COSHH Assessments
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {loading ? '...' : assessmentsCount}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <ShieldAlert className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </button>
        </SpotlightCard>

        {/* MSDS Safety Sheets Widget */}
        <SpotlightCard
          isDarkMode={isDarkMode}
          spotlightColor="rgba(255, 214, 92, 0.4)"
          darkSpotlightColor="rgba(255, 214, 92, 0.2)"
          size={400}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden relative"
        >
          <button
            onClick={() => setShowMSDSSheets(true)}
            className="w-full h-full text-left"
          >
            <div className="relative z-10">
              <div className="mb-6">
                <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">
                  03
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                  MSDS Safety Sheets
                </h3>
              </div>
              <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                {loading ? '...' : msdsSheetsCount}
              </div>
            </div>
            <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                  <path fill="#FFF6F6" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)" />
                </svg>
              </div>
              <FileCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ color: '#FCA5A5' }} />
            </div>
          </button>
        </SpotlightCard>
      </div>
     
    </div>
  );
}