import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { CombinedStaffUser, StaffMember } from '../types';
import { formatPhoneNumber, formatDate } from '../utils';

interface StaffTableProps {
  filteredStaffUsers: CombinedStaffUser[];
  loading: boolean;
  onEditStaff: (staffMember: StaffMember) => void;
  onDeleteStaff: (staffMember: StaffMember) => void;
  onViewUser: (user: CombinedStaffUser) => void;
  staff: StaffMember[];
}

export function StaffTable({
  filteredStaffUsers,
  loading,
  onEditStaff,
  onDeleteStaff,
  onViewUser,
  staff
}: StaffTableProps) {
  const handleRowClick = (member: CombinedStaffUser) => {
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

  return (
    <div className="hidden lg:block bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Name
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Type
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Email
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Position
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Phone
                </th>
                <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Start Date
                </th>
                <th className="sticky top-0 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredStaffUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No staff or users found
                  </td>
                </tr>
              ) : (
                filteredStaffUsers.map((member) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleRowClick(member)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.type === 'staff' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
                          : member.type === 'worker' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {member.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {member.position || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatPhoneNumber(member.phone)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(member.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-4">
                        {member.type === 'staff' && (
                          <>
                            <button
                              onClick={(e) => handleEditClick(e, member)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, member)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        {member.type === 'user' && (
                          <button
                            onClick={(e) => handleUserClick(e, member)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            title="View Details"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
