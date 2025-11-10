import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatSignedDate } from '../utils/dashboardUtils';

interface WorkerRow2HRWidgetsProps {
  handbookSignedDate: string | null;
  annualTrainingSignedDate: string | null;
  policyCounts: {signed: number, unsigned: number};
  riskAssessmentCounts: {signed: number, unsigned: number};
  handleOpenFile: () => void;
  handleOpenAnnualTraining: () => void;
}

export function WorkerRow2HRWidgets({
  handbookSignedDate,
  annualTrainingSignedDate,
  policyCounts,
  riskAssessmentCounts,
  handleOpenFile,
  handleOpenAnnualTraining
}: WorkerRow2HRWidgetsProps) {
  const navigate = useNavigate();

  // Helper function to check if a date is overdue (over 365 days)
  const isOverdue = (dateString: string | null): boolean => {
    if (!dateString) return false;
    const signedDate = new Date(dateString);
    const today = new Date();
    const daysDifference = Math.floor((today.getTime() - signedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDifference > 365;
  };

  return (
    <>
      {/* HR Line with Break */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">HR Documents</span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      {/* Second Row of Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Policies Widget */}
        <div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer"
          onClick={() => navigate('/workers/policies')}
        >
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
          <div className="relative z-10">
            <button className="w-full h-full text-left">
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">05</p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">Policies</h3>
                  <div className="mt-2 text-sm">
                    <span className="text-green-600 dark:text-green-400 font-semibold">Signed {policyCounts.signed}</span>
                    {' | '}
                    <span className="text-red-600 dark:text-red-400 font-semibold">Unsigned {policyCounts.unsigned}</span>
                  </div>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                  {policyCounts.unsigned > 0 ? 'You must read & sign' : 'All policies signed'}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" aria-hidden="true" style={{color: 'rgb(165, 167, 252)'}}>
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Risk Assessments Widget */}
        <div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer"
          onClick={() => navigate('/workers/risk-assessments')}
        >
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
          <div className="relative z-10">
            <button className="w-full h-full text-left">
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">06</p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">Risk Assessments</h3>
                  <div className="mt-2 text-sm">
                    <span className="text-green-600 dark:text-green-400 font-semibold">Signed {riskAssessmentCounts.signed}</span>
                    {' | '}
                    <span className="text-red-600 dark:text-red-400 font-semibold">Unsigned {riskAssessmentCounts.unsigned}</span>
                  </div>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                  {riskAssessmentCounts.unsigned > 0 ? 'Read & sign available risk assessments' : 'All risk assessments signed'}
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" aria-hidden="true" style={{color: 'rgb(165, 167, 252)'}}>
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Employee Safety Handbook Widget */}
        <div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer"
          onClick={handleOpenFile}
        >
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
          <div className="relative z-10">
            <button className="w-full h-full text-left">
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">07</p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Employee Safety Handbook
                  </h3>
                  <div className="mt-2 text-sm">
                    {handbookSignedDate ? (
                      isOverdue(handbookSignedDate) ? (
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          Overdue - Signed {formatSignedDate(handbookSignedDate)}
                        </span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          Signed {formatSignedDate(handbookSignedDate)}
                        </span>
                      )
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        Not Signed
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                  {!handbookSignedDate || isOverdue(handbookSignedDate) 
                    ? 'You must read and sign' 
                    : 'Employee Safety Handbook signed'
                  }
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47-2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" aria-hidden="true" style={{color: 'rgb(165, 167, 252)'}}>
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Annual Training Widget */}
        <div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer"
          onClick={handleOpenAnnualTraining}
        >
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{opacity: 0, background: 'radial-gradient(400px at 215px 141px, rgba(165, 243, 252, 0.4), transparent 70%)'}}></div>
          <div className="relative z-10">
            <button className="w-full h-full text-left">
              <div className="relative z-10">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-pink-300 dark:text-pink-400 text-left">08</p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1 text-left">
                    Annual Training
                  </h3>
                  <div className="mt-2 text-sm">
                    {annualTrainingSignedDate ? (
                      isOverdue(annualTrainingSignedDate) ? (
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          Overdue - Signed {formatSignedDate(annualTrainingSignedDate)}
                        </span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          Signed {formatSignedDate(annualTrainingSignedDate)}
                        </span>
                      )
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        Not Signed
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-lg font-medium text-gray-900 dark:text-white text-left">
                  {!annualTrainingSignedDate || isOverdue(annualTrainingSignedDate) 
                    ? 'You must read and sign' 
                    : 'Annual Training completed'
                  }
                </div>
              </div>
              <div className="absolute -top-5 -right-1 w-16 h-16 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10 dark:opacity-20">
                    <path fill="#f6f9ff" d="M48.1,-58.9C61.4,-47.2,70.5,-31.1,74.9,-12.8C79.3,5.5,79,26,70.5,41.2C62,56.4,45.3,66.3,27.5,72.1C9.7,77.9,-9.2,79.5,-25.9,73.8C-42.6,68.1,-57.1,55.1,-66,39.1C-74.9,23.1,-78.2,4.1,-74.6,-13C-71,-30.1,-60.5,-45.2,-47.1,-57C-33.7,-68.8,-16.8,-77.3,0.9,-78.1C18.7,-78.9,37.3,-71.9,48.1,-58.9Z" transform="translate(100 100)"></path>
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8" aria-hidden="true" style={{color: 'rgb(165, 167, 252)'}}>
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9" x2="8" y2="9"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}