import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PositionType } from '../types';

interface EmployeeFormProps {
  selectedId: string | null;
  orgDataId: string;
  newName: string;
  setNewName: (name: string) => void;
  newDepartment: string;
  setNewDepartment: (department: string) => void;
  newPosition: PositionType;
  setNewPosition: (position: PositionType) => void;
  linkingMode: boolean;
  setLinkingMode: (mode: boolean) => void;
  setLinkingFromId: (id: string | null) => void;
  onAddEmployee: () => void;
  onRemoveEmployee: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  selectedId,
  orgDataId,
  newName,
  setNewName,
  newDepartment,
  setNewDepartment,
  newPosition,
  setNewPosition,
  linkingMode,
  setLinkingMode,
  setLinkingFromId,
  onAddEmployee,
  onRemoveEmployee
}) => {
  if (!selectedId || linkingMode) return null;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Employee Name"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Department</label>
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="Department"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Position</label>
          <select
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value as PositionType)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {selectedId === orgDataId ? (
              <option value="Director">Director</option>
            ) : (
              <>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Team Lead">Team Lead</option>
              </>
            )}
          </select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onAddEmployee}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="w-4 h-4" />
            Add {selectedId === orgDataId ? 'Director' : 'Employee'}
          </button>
          {selectedId !== orgDataId && (
            <button
              onClick={onRemoveEmployee}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {linkingMode && (
            <button
              onClick={() => {
                setLinkingMode(false);
                setLinkingFromId(null);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Cancel Linking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
