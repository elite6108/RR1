import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Shield, ChevronLeft } from 'lucide-react';
import { useDSEAssessments } from './hooks/useDSEAssessments';
import { DSEForm } from './DSEForm';
import { AdminModal } from './components/AdminModal';
import { AssessmentsTable } from './components/AssessmentsTable';

export function DisplayScreenAssessment({ onBack }: { onBack: () => void }) {
  const [showForm, setShowForm] = useState(false);
      const {
    assessments,
    loading,
    isAdminView,
    showAdminModal,
    adminPassword,
    passwordError,
    generatingPDF,
    setShowAdminModal,
    setAdminPassword,
    setPasswordError,
    handleAdminPasswordSubmit,
    handleExitAdminView,
    handleViewAssessment,
    fetchAssessments,
  } = useDSEAssessments();



  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Training
        </button>
              </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          DSE Assessments
        </h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {isAdminView ? (
            <button
              onClick={handleExitAdminView}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Shield className="h-4 w-4 mr-2" />
              Exit Admin View
            </button>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin View
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Complete DSE
          </button>
        </div>
      </div>

      <AssessmentsTable
        assessments={assessments}
        isAdminView={isAdminView}
        onViewAssessment={handleViewAssessment}
        generatingPDF={generatingPDF}
        loading={loading}
      />

      {showForm && createPortal(
        <DSEForm
          onClose={() => {
            setShowForm(false);
            fetchAssessments();
          }}
        />,
        document.body
      )}

      <AdminModal
        isOpen={showAdminModal}
        onClose={() => {
                setShowAdminModal(false);
                setAdminPassword('');
                setPasswordError('');
              }}
        onSubmit={handleAdminPasswordSubmit}
        loading={loading}
        error={passwordError}
      />
    </div>
  );
}
