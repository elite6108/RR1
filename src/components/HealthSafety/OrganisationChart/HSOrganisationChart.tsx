import React, { useState, useRef, useEffect } from 'react';
import { Tree } from 'react-organizational-chart';
import { ChevronLeft, Plus, Trash2, Check, Download, Loader2 } from 'lucide-react';

// Types
import { HSOrganisationChartProps, Employee, Position, PositionType } from './types';

// Hooks
import { useOrgChart } from './hooks/useOrgChart';
import { useEmployeeManagement } from './hooks/useEmployeeManagement';
import { useReportingLines } from './hooks/useReportingLines';

// Utils
import { updateNodePositions, drawSecondaryLines } from './utils/positionUtils';
import { exportToPDF } from './utils/pdfExport';

// Components
import { EmployeeNode } from './components/EmployeeNode';
import { AddDirectorModal } from './components/AddDirectorModal';
import { EmployeeForm } from './components/EmployeeForm';
import { ErrorModal } from './components/ErrorModal';
import { SuccessMessage } from './components/SuccessMessage';

export function HSOrganisationChart({ onBack }: HSOrganisationChartProps) {
  // Main chart state and operations
  const {
    orgData,
    setOrgData,
    setLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    clearAndInitialize,
    fetchOrgChart
  } = useOrgChart();

  // Employee management operations
  const {
    addEmployee,
    removeEmployee,
    handleEditChange,
    saveAllChanges
  } = useEmployeeManagement(
    orgData,
    setOrgData,
    setLoading,
    setError,
    setSuccessMessage,
    fetchOrgChart
  );

  // Reporting lines management
  const {
    linkingMode,
    setLinkingMode,
    linkingFromId,
    setLinkingFromId,
    addReportingLine,
    removeReportingLine
  } = useReportingLines(
    orgData,
    setOrgData,
    setLoading,
    setError,
    fetchOrgChart
  );

  // Local component state
  const [showAddModal, setShowAddModal] = useState(false);
  const [directorNames, setDirectorNames] = useState(['', '', '']);
  const [directorPositions, setDirectorPositions] = useState(['', '', '']);
  const [newName, setNewName] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newPosition, setNewPosition] = useState<PositionType>('Employee');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [nodePositions, setNodePositions] = useState<Map<string, Position>>(new Map());
  const [secondaryLines, setSecondaryLines] = useState<JSX.Element[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Helper functions
  const startEditing = (employee: Employee) => {
    setEditingId(employee.id);
    setEditName(employee.name);
    setEditTitle(employee.title);
  };

  // Wrapper function to handle edit change and close edit mode
  const handleEditChangeAndClose = (id: string, name: string, title: string) => {
    handleEditChange(id, name, title);
    setEditingId(null); // Close edit mode after applying changes
  };

  // Cancel editing function
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditTitle('');
  };

  const renderNode = (employee: Employee): JSX.Element => {
      return (
      <EmployeeNode
        employee={employee}
        orgData={orgData}
        selectedId={selectedId}
        linkingMode={linkingMode}
        linkingFromId={linkingFromId}
        editingId={editingId}
        editName={editName}
        editTitle={editTitle}
        setEditName={setEditName}
        setEditTitle={setEditTitle}
        setSelectedId={setSelectedId}
        setLinkingMode={setLinkingMode}
        setLinkingFromId={setLinkingFromId}
        startEditing={startEditing}
        handleEditChange={handleEditChangeAndClose}
        handleCancelEdit={handleCancelEdit}
        addReportingLine={addReportingLine}
        removeReportingLine={removeReportingLine}
        renderNode={renderNode}
      />
    );
  };

  // Handle director addition
  const handleAddDirectors = () => {
    const validDirectors = directorNames
      .map((name, i) => ({ name, position: directorPositions[i] }))
      .filter(d => d.name.trim() && d.position.trim());
    
    if (validDirectors.length > 0) {
      const combinedName = validDirectors.map(d => d.name).join(' / ');
      const combinedPosition = validDirectors.map(d => d.position).join(' / ');
      addEmployee(orgData.id, combinedName, combinedPosition, true);
    }
    setShowAddModal(false);
  };

  // Handle employee form actions
  const handleAddEmployee = () => {
    if (selectedId) {
      addEmployee(selectedId, newName, newPosition, false);
      setNewName('');
      setNewDepartment('');
      setNewPosition('Employee');
    }
  };

  const handleRemoveEmployee = () => {
    if (selectedId) {
      removeEmployee(selectedId);
      setSelectedId(null);
    }
  };

  const handleExportToPDF = () => {
    exportToPDF(setGeneratingPdf, setLoading, setError);
  };

  // Position and line management effects
  useEffect(() => {
    const observer = new MutationObserver(() => 
      updateNodePositions(chartRef, setNodePositions)
    );
    if (chartRef.current) {
      observer.observe(chartRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true,
      });
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    updateNodePositions(chartRef, setNodePositions);
    drawSecondaryLines(orgData, nodePositions, setSecondaryLines);
  }, [orgData, nodePositions]);





  return (
    <div className="min-h-screen bg-gray-100">
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



      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Organisation Chart</h2>
        <div className="flex items-center justify-between mb-6 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              {!orgData.children.length && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Director
                </button>
              )}
              <button
                onClick={saveAllChanges}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={clearAndInitialize}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
              <button
                onClick={handleExportToPDF}
                disabled={generatingPdf}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-full sm:w-auto"
              >
                {generatingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Export to PDF
              </button>
            </div>
          </div>
      </div>


      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          
          
          {/* Message when no directors are added */}
          {!orgData.children.length && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
              <p className="text-blue-800 font-medium">
                To begin please add a director first
              </p>
            </div>
          )}
          
          <SuccessMessage 
            successMessage={successMessage} 
            setSuccessMessage={setSuccessMessage} 
          />
          
          {/* Helper text for adding members */}
          {orgData.children.length > 0 && !selectedId && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800">
              To add more members, click on a person in the chart to select them. Once selected, you’ll be able to add details such as their name, department, and more in this section.              </p>
            </div>
          )}

          <AddDirectorModal 
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            directorNames={directorNames}
            directorPositions={directorPositions}
            setDirectorNames={setDirectorNames}
            setDirectorPositions={setDirectorPositions}
            onAddDirectors={handleAddDirectors}
          />

          <EmployeeForm 
            selectedId={selectedId}
            orgDataId={orgData.id}
            newName={newName}
            setNewName={setNewName}
            newDepartment={newDepartment}
            setNewDepartment={setNewDepartment}
            newPosition={newPosition}
            setNewPosition={setNewPosition}
            linkingMode={linkingMode}
            setLinkingMode={setLinkingMode}
            setLinkingFromId={setLinkingFromId}
            onAddEmployee={handleAddEmployee}
            onRemoveEmployee={handleRemoveEmployee}
          />

          {linkingMode && (
            <div className="bg-yellow-50 p-4 rounded-lg mt-6">
              <p className="text-yellow-800">
                Select an employee to create a new reporting line. A dotted line will show the secondary reporting relationship.
              </p>
            </div>
          )}
        </div>
        
        <div id="org-chart" ref={chartRef} className="bg-gray-100 rounded-lg overflow-auto relative">
          {secondaryLines}
          <Tree
            lineWidth="2px"
            lineColor="#94a3b8"
            lineBorderRadius="6px"
            label={renderNode(orgData)}
          />
        </div>
      </div>

      <ErrorModal error={error} setError={setError} />
    </div>
  );
} 