import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CPPFormData } from '../../../../../types/cpp';

interface Step4HoursTeamProps {
  data: CPPFormData;
  onChange: (data: Partial<CPPFormData>) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const TEAM_MEMBER_ROLES = [
  'Client',
  'Consultant',
  'Contractor',
  'Designer',
  'Principal Contractor',
  'Principal Designer',
  'Sub-Contractor',
  'Other'
] as const;

export function Step4HoursTeam({ data, onChange }: Step4HoursTeamProps) {
  const handleDayToggle = (day: string) => {
    const currentDays = data.hoursTeam.workingDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    onChange({
      hoursTeam: {
        ...data.hoursTeam,
        workingDays: newDays
      }
    });
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      hoursTeam: {
        ...data.hoursTeam,
        hours: e.target.value
      }
    });
  };

  const addTeamMember = () => {
    const newMember = {
      id: crypto.randomUUID(),
      role: '',
      name: '',
      contact: ''
    };

    onChange({
      hoursTeam: {
        ...data.hoursTeam,
        keyMembers: [...(data.hoursTeam.keyMembers || []), newMember]
      }
    });
  };

  const updateTeamMember = (id: string, field: string, value: string) => {
    onChange({
      hoursTeam: {
        ...data.hoursTeam,
        keyMembers: (data.hoursTeam.keyMembers || []).map(member =>
          member.id === id ? { ...member, [field]: value } : member
        )
      }
    });
  };

  const removeTeamMember = (id: string) => {
    onChange({
      hoursTeam: {
        ...data.hoursTeam,
        keyMembers: (data.hoursTeam.keyMembers || []).filter(member => member.id !== id)
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Hours & Team</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Working Days
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayToggle(day)}
              className={`
                w-full flex items-start p-4 rounded-lg text-left transition-colors
                ${data.hoursTeam.workingDays?.includes(day)
                  ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-1
                  ${data.hoursTeam.workingDays?.includes(day)
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-gray-300'
                  }
                `}>
                  {data.hoursTeam.workingDays?.includes(day) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium">{day}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
          Hours
        </label>
        <input
          type="text"
          id="hours"
          value={data.hoursTeam.hours || ''}
          onChange={handleHoursChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. 8:00 AM - 5:00 PM"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Key Team Members
          </label>
          <button
            type="button"
            onClick={addTeamMember}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Member
          </button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {(data.hoursTeam.keyMembers || []).map(member => (
            <div key={member.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={member.role}
                    onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a role</option>
                    {TEAM_MEMBER_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      +44
                    </span>
                    <input
                      type="tel"
                      value={member.contact}
                      onChange={(e) => updateTeamMember(member.id, 'contact', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeTeamMember(member.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {!data.hoursTeam.keyMembers?.length && (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              Click "Add Member" to add key team members
            </div>
          )}
        </div>
      </div>
    </div>
  );
}