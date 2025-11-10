import React from 'react';
import { TreeNode } from 'react-organizational-chart';
import { User, Users, Edit2, Link, Check, X } from 'lucide-react';
import { Employee } from '../types';
import { findEmployee } from '../utils/employeeUtils';

interface EmployeeNodeProps {
  employee: Employee;
  orgData: Employee;
  selectedId: string | null;
  linkingMode: boolean;
  linkingFromId: string | null;
  editingId: string | null;
  editName: string;
  editTitle: string;
  setEditName: (name: string) => void;
  setEditTitle: (title: string) => void;
  setSelectedId: (id: string | null) => void;
  setLinkingMode: (mode: boolean) => void;
  setLinkingFromId: (id: string | null) => void;
  startEditing: (employee: Employee) => void;
  handleEditChange: (id: string, name: string, title: string) => void;
  handleCancelEdit: () => void;
  addReportingLine: (managerId: string, employeeId: string) => void;
  removeReportingLine: (managerId: string, employeeId: string) => void;
  renderNode: (employee: Employee) => JSX.Element;
}

export const EmployeeNode: React.FC<EmployeeNodeProps> = ({
  employee,
  orgData,
  selectedId,
  linkingMode,
  linkingFromId,
  editingId,
  editName,
  editTitle,
  setEditName,
  setEditTitle,
  setSelectedId,
  setLinkingMode,
  setLinkingFromId,
  startEditing,
  handleEditChange,
  handleCancelEdit,
  addReportingLine,
  removeReportingLine,
  renderNode
}) => {
  const selectedEmployee = selectedId ? findEmployee(selectedId, orgData) : null;
  const isParentSelected = selectedEmployee?.children.some(child => child.id === employee.id);
  const isLinkTarget = linkingMode && linkingFromId && linkingFromId !== employee.id;
  const isDirector = !employee.reportsTo.length && employee.id !== orgData.id;
  const isManager = employee.title.toLowerCase().includes('manager');

  const renderEmployeeContent = (emp: Employee) => {
    const names = emp.name.split(' / ');
    const positions = emp.title.split(' / ');
    const isMultipleDirectors = isDirector && names.length > 1;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {emp.children.length > 0 ? (
            <Users className="w-5 h-5 text-blue-400 dark:text-blue-300" />
          ) : (
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
          <div className="flex-1">
            {isMultipleDirectors ? (
              <>
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  {names.map((name, idx) => (
                    <div key={idx} className="flex items-center">
                      {name}
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                        {positions[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{emp.name}</p>
                <p className={`text-sm ${
                  isDirector 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : isManager 
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400'
                }`}>{emp.title}</p>
              </>
            )}
            {emp.reportsTo.length > 1 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Reports to:{' '}
                {emp.reportsTo.map((managerId, index) => {
                  const manager = findEmployee(managerId, orgData);
                  if (!manager) return null;
                  return (
                    <span key={managerId} className="inline-flex items-center">
                      {index > 0 && ', '}
                      {manager.name}
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeReportingLine(managerId, emp.id);
                          }}
                          className="ml-1 p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-full"
                          title="Remove reporting line"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {selectedId === emp.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLinkingMode(true);
                  setLinkingFromId(emp.id);
                }}
                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                title="Add reporting line"
              >
                <Link className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                startEditing(emp);
              }}
              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"  
              title="Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Special handling for root node - make it invisible and render directors horizontally
  if (employee.id === orgData.id) {
    return (
      <TreeNode
        key={employee.id}
        label={<div style={{ display: 'none' }}></div>}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '4rem', minWidth: '100%' }}>
          {employee.children.map(child => (
            <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TreeNode
                label={
                  <div 
                    data-employee-id={child.id}
                    className={`p-4 rounded-lg shadow-md transition-all cursor-pointer relative
                      ${selectedId === child.id ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' : 
                        isParentSelected ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-500' : 
                        isLinkTarget ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-500' :
                        'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => setSelectedId(child.id)}
                    style={{ width: '250px', maxWidth: '250px', margin: '0 auto' }}
                  >
                    {editingId === child.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditChange(child.id, editName, editTitle);
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelEdit();
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      renderEmployeeContent(child)
                    )}
                  </div>
                }
              >
                {child.children.map(renderNode)}
              </TreeNode>
            </div>
          ))}
        </div>
      </TreeNode>
    );
  }

  return (
    <TreeNode
      key={employee.id}
      label={
        <div 
          data-employee-id={employee.id}
          className={`p-4 rounded-lg shadow-md transition-all cursor-pointer relative
            ${selectedId === employee.id 
              ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' 
              : isParentSelected 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-500' 
                : isLinkTarget 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-500'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          onClick={() => {
            if (linkingMode && linkingFromId) {
              addReportingLine(employee.id, linkingFromId);
            } else {
              setSelectedId(employee.id);
            }
          }}
          style={{ width: '250px', maxWidth: '250px', margin: '0 auto' }}
        >
          {editingId === employee.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-2 py-1 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-2 py-1 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditChange(employee.id, editName, editTitle);
                  }}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            renderEmployeeContent(employee)
          )}
        </div>
      }
    >
      {employee.children.map(renderNode)}
    </TreeNode>
  );
};
