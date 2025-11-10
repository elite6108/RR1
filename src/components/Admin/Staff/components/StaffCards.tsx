import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { CombinedStaffUser, StaffMember } from '../types';
import { formatPhoneNumber, formatDate } from '../utils';

interface StaffCardsProps {
  filteredStaffUsers: CombinedStaffUser[];
  loading: boolean;
  onEditStaff: (staffMember: StaffMember) => void;
  onDeleteStaff: (staffMember: StaffMember) => void;
  onViewUser: (user: CombinedStaffUser) => void;
  staff: StaffMember[];
}

export function StaffCards({
  filteredStaffUsers,
  loading,
  onEditStaff,
  onDeleteStaff,
  onViewUser,
  staff
}: StaffCardsProps) {
  const handleCardClick = (member: CombinedStaffUser) => {
    if (member.type === 'staff') {
      const staffMember = staff.find(s => s.id === member.original_id);
      if (staffMember) {
        onEditStaff(staffMember);
      }
    } else {
      onViewUser(member);
    }
  };

  const handleEditClick = (e: React.MouseEvent, member: CombinedStaffUser) => {
    e.stopPropagation();
    const staffMember = staff.find(s => s.id === member.original_id);
    if (staffMember) {
      onEditStaff(staffMember);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, member: CombinedStaffUser) => {
    e.stopPropagation();
    const staffMember = staff.find(s => s.id === member.original_id);
    if (staffMember) {
      onDeleteStaff(staffMember);
    }
  };

  const handleUserClick = (e: React.MouseEvent, member: CombinedStaffUser) => {
    e.stopPropagation();
    onViewUser(member);
  };

  if (loading) {
    return (
      <div className="lg:hidden flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (filteredStaffUsers.length === 0) {
    return (
      <div className="lg:hidden text-center py-8 text-gray-500 dark:text-gray-400">
        No staff or users found
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-4">
      {filteredStaffUsers.map((member) => (
        <div 
          key={member.id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(member)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  member.type === 'staff' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
                    : member.type === 'worker' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {member.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.position || 'N/A'}</p>
            </div>
            <div className="flex space-x-2">
              {member.type === 'staff' && (
                <>
                  <button
                    onClick={(e) => handleEditClick(e, member)}
                    className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, member)}
                    className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
              {member.type === 'user' && (
                <button
                  onClick={(e) => handleUserClick(e, member)}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20 rounded-md"
                  title="View Details"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Contact Email:</span>
              <span className="text-gray-900 dark:text-white">{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <span className="text-gray-900 dark:text-white">
                  {formatPhoneNumber(member.phone)}
                </span>
              </div>
            )}
            {member.ni_number && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">NI Number:</span>
                <span className="text-gray-900 dark:text-white">{member.ni_number}</span>
              </div>
            )}
            {member.start_date && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(member.start_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
