import React, { useState } from 'react';
import { X, Search, ChevronLeft, Loader2, Shield } from 'lucide-react';
import { WorkersProps, Worker, SortField, SortDirection } from './Workers/types';
import { useWorkers } from './Workers/hooks/useWorkers';
import { useWorkerForm } from './Workers/hooks/useWorkerForm';
import { useHealthQuestionnaireAdmin } from './Workers/hooks/useHealthQuestionnaireAdmin';
import { WorkerForm } from './Workers/components/WorkerForm';
import { WorkersTable } from './Workers/components/WorkersTable';
import { WorkersCards } from './Workers/components/WorkersCards';
import { PortalModal } from './Workers/components/PortalModal';
import { AdminModal } from './Workers/components/AdminModal';

export function Workers({ 
  onBack,
}: WorkersProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('full_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { workers, loading, error, fetchWorkers, deleteWorker } = useWorkers();
  
  const workerForm = useWorkerForm(async () => {
      await fetchWorkers();
      setShowAddForm(false);
      setEditingWorkerId(null);
  });

  const {
    isAdminView,
    showAdminModal,
    passwordError,
    loading: adminLoading,
    handleAdminPasswordSubmit,
    handleExitAdminView,
    handleShowAdminModal,
    handleCloseAdminModal,
  } = useHealthQuestionnaireAdmin();

  const handleEdit = async (worker: Worker) => {
    await workerForm.populateFormWithWorker(worker);
    setEditingWorkerId(worker.id);
    setShowAddForm(true);
  };

  const confirmDelete = (id: string) => {
    setWorkerToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!workerToDelete) return;
    await deleteWorker(workerToDelete);
      setShowDeleteModal(false);
      setWorkerToDelete(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const query = searchQuery.toLowerCase();
    return (
      worker.full_name?.toLowerCase().includes(query) ||
      worker.email?.toLowerCase().includes(query) ||
      worker.phone?.toLowerCase().includes(query) ||
      worker.company?.toLowerCase().includes(query)
    );
  });

  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (sortField === 'full_name') {
      const comparison = (a.full_name || '').localeCompare(b.full_name || '');
      return sortDirection === 'asc' ? comparison : -comparison;
    } else if (sortField === 'last_health_questionnaire') {
      const dateA = a.last_health_questionnaire ? new Date(a.last_health_questionnaire).getTime() : 0;
      const dateB = b.last_health_questionnaire ? new Date(b.last_health_questionnaire).getTime() : 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Customers & Projects
        </button>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Workers Management
      </h1>

      <div className="flex items-center">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, phone or company..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="ml-4 flex space-x-3">
        {!isAdminView ? (
          <button
            onClick={handleShowAdminModal}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto"
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin View
          </button>
        ) : (
          <button
            onClick={handleExitAdminView}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto"
          >
            <Shield className="h-4 w-4 mr-2" />
            Exit Admin View
          </button>
        )}
        <button
          onClick={() => fetchWorkers()}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
          disabled={loading}
        >
          <Loader2 className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          <span className="ml-2">{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
    </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <WorkerForm
          formData={workerForm.formData}
          loading={workerForm.loading}
          onInputChange={workerForm.handleInputChange}
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            workerForm.handleSubmit(editingWorkerId);
          }}
          onCancel={() => {
                  setShowAddForm(false);
                  setEditingWorkerId(null);
            workerForm.resetForm();
          }}
        />
      )}

      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="p-6 text-center">Loading workers...</div>
        ) : filteredWorkers.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No workers found. Workers must sign up through the Contractor Worker
            signup form.
          </div>
        ) : (
          <>
            <WorkersTable
              workers={sortedWorkers}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={confirmDelete}
              isAdminView={isAdminView}
            />
            <WorkersCards
              workers={sortedWorkers}
              onEdit={handleEdit}
              onDelete={confirmDelete}
              isAdminView={isAdminView}
            />
          </>
        )}
      </div>

      <PortalModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setWorkerToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Worker"
        message="Are you sure you want to delete this worker? This action cannot be undone."
        confirmText="Delete"
        loading={loading}
      />

      <AdminModal
        isOpen={showAdminModal}
        onClose={handleCloseAdminModal}
        onSubmit={handleAdminPasswordSubmit}
        loading={adminLoading}
        error={passwordError}
      />
    </div>
  );
}
