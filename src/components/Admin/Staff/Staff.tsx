import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, AlertTriangle, CircleCheckBig, Plus, Wrench } from 'lucide-react';
import { supabase } from '../../../lib/supabase.ts';
import { useStaffData, useTokenManagement } from './hooks';
import {
  DeleteModal,
  AddEditModal,
  UserDetailsModal,
  TokenModal,
  StaffTable,
  StaffCards
} from './components';
import { handleCopyToken, validatePhoneNumber, validateNINumber } from './utils';
import type { StaffProps, StaffMember, CombinedStaffUser, FormData } from './types';

export function Staff({ setShowStaff, setShowAdminDashboard }: StaffProps) {
  // Data hooks
  const {
    staff,
    setStaff,
    setUsers,
    combinedStaffUsers,
    userDetails,
    setUserDetails,
    loading,
    error,
    setError
  } = useStaffData();

  const {
    companyToken,
    workerToken,
    tokenLoading,
    fetchTokens,
    handleGenerateCompanyToken,
    handleGenerateWorkerToken
  } = useTokenManagement();

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CombinedStaffUser | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddModal || showEditModal || showDeleteModal || showTokenModal || showUserDetailsModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, showEditModal, showDeleteModal, showTokenModal, showUserDetailsModal]);

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleEdit = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setShowEditModal(true);
  };

  const handleDelete = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setShowDeleteModal(true);
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setShowAddModal(true);
  };

  const handleViewUser = (user: CombinedStaffUser) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', selectedStaff.id);

      if (error) throw error;

      setStaff(staff.filter((s) => s.id !== selectedStaff.id));
      setShowDeleteModal(false);
      setSuccessMessage('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff member:', error);
      setError('Failed to delete staff member');
    }
  };

  const handleStaffSubmit = async (formData: FormData) => {
    setError(null);

    try {
      if (showEditModal && selectedStaff) {
        const { error } = await supabase
          .from('staff')
          .update(formData)
          .eq('id', selectedStaff.id);

        if (error) throw error;

        setStaff(
          staff.map((s) =>
            s.id === selectedStaff.id ? { ...s, ...formData } : s
          )
        );
        setShowEditModal(false);
        setSuccessMessage('Staff member updated successfully');
      } else if (showAddModal) {
        const { data, error } = await supabase
          .from('staff')
          .insert([formData])
          .select();

        if (error) throw error;
        if (data) {
          setStaff([...staff, data[0]]);
          setSuccessMessage('Staff member added successfully');
        }
        setShowAddModal(false);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving'
      );
      console.error('Error saving staff member:', error);
    }
  };

  const handleUserSubmit = async (formData: FormData) => {
    setError(null);

    try {
      if (!selectedUser) return;

      // Check if this user already exists as a staff member
      const existingStaffMember = staff.find(s => s.email === formData.email);
      
      if (existingStaffMember) {
        // Update existing staff member
        const { error } = await supabase
          .from('staff')
          .update({
            name: formData.name,
            position: formData.position,
            phone: formData.phone,
            ni_number: formData.ni_number,
            start_date: formData.start_date,
          })
          .eq('id', existingStaffMember.id);

        if (error) throw error;

        // Update local state
        setStaff(prevStaff => 
          prevStaff.map(s => 
            s.id === existingStaffMember.id 
              ? { ...s, ...formData }
              : s
          )
        );
        setSuccessMessage('Staff member updated successfully');
      } else {
        // Update the users list with the name
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.original_id 
              ? { ...user, full_name: formData.name }
              : user
          )
        );
        
        // Store additional user details
        setUserDetails(prevDetails => ({
          ...prevDetails,
          [selectedUser.original_id]: {
            name: formData.name,
            position: formData.position,
            phone: formData.phone,
            ni_number: formData.ni_number,
            start_date: formData.start_date
          }
        }));
        
        setSuccessMessage('User details updated successfully');
      }
      
      setShowUserDetailsModal(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving'
      );
      console.error('Error saving user details:', error);
    }
  };

  const handleConvertUserToStaff = async () => {
    if (!selectedUser) {
      setError('No user selected');
      return;
    }

    // Get stored details for this user
    const storedDetails = userDetails[selectedUser.original_id as string] || {};
    const formData = {
      name: storedDetails.name || selectedUser.name || '',
      position: storedDetails.position || selectedUser.position || '',
      email: selectedUser.email || '',
      phone: storedDetails.phone || selectedUser.phone || '',
      ni_number: storedDetails.ni_number || selectedUser.ni_number || '',
      start_date: storedDetails.start_date || selectedUser.start_date || '',
    };

    if (!formData.name || !formData.email) {
      setError('Please fill in required fields before converting to staff');
      return;
    }

    setError(null);

    // Validate phone number if provided
    if (formData.phone) {
      const phoneError = validatePhoneNumber(formData.phone);
      if (phoneError) {
        setError(phoneError);
        return;
      }
    }

    // Validate NI number if provided
    if (formData.ni_number) {
      const niError = validateNINumber(formData.ni_number);
      if (niError) {
        setError(niError);
        return;
      }
    }

    try {
      // Check if this user already exists as a staff member
      const existingStaffMember = staff.find(s => s.email === formData.email);
      
      if (existingStaffMember) {
        setError('This user is already a staff member');
        return;
      }

      // Create new staff member from user data
      const { data, error } = await supabase
        .from('staff')
        .insert([formData])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        // Add to local state
        setStaff(prevStaff => [...prevStaff, data[0]]);
        setSuccessMessage('User converted to staff member successfully');
        setShowUserDetailsModal(false);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while converting user to staff'
      );
      console.error('Error converting user to staff:', error);
    }
  };

  const filteredStaffUsers = combinedStaffUsers.filter((member) => {
    if (member.type === 'worker') {
      return false;
    }
    const query = searchQuery.toLowerCase();
    return (
      member.name?.toLowerCase().includes(query) ||
      member.position?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.phone?.toLowerCase().includes(query) ||
      member.type?.toLowerCase().includes(query)
    );
  });

  const handleTokensClick = async () => {
    await fetchTokens();
    setShowTokenModal(true);
  };

  const handleCopyTokenClick = async (token: string) => {
    const result = await handleCopyToken(token);
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={() => {
            setShowStaff(false);
            setShowAdminDashboard(true);
          }}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Company Section
        </button>
       </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Staff & Users Management</h2>
      </div>

      <p>To add new staff, please get them to register as a user. For workers, they will need to register through the worker login.</p>

      {/* Search Box with Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search by name, position, email, phone or type..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleTokensClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Tokens
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hide"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
          <CircleCheckBig className="h-5 w-5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Staff & Users Table - Desktop */}
      <StaffTable
        filteredStaffUsers={filteredStaffUsers}
        loading={loading}
        onEditStaff={handleEdit}
        onDeleteStaff={handleDelete}
        onViewUser={handleViewUser}
        staff={staff}
      />

      {/* Staff & Users Cards - Mobile/Tablet */}
      <StaffCards
        filteredStaffUsers={filteredStaffUsers}
        loading={loading}
        onEditStaff={handleEdit}
        onDeleteStaff={handleDelete}
        onViewUser={handleViewUser}
        staff={staff}
      />

      {/* Modals */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        staffMember={selectedStaff}
      />

      <AddEditModal
        isOpen={showAddModal || showEditModal}
        isEditMode={showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        onSubmit={handleStaffSubmit}
        staffMember={selectedStaff}
      />

      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        onSubmit={handleUserSubmit}
        onConvertToStaff={handleConvertUserToStaff}
        user={selectedUser}
      />

      <TokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        companyToken={companyToken}
        workerToken={workerToken}
        onGenerateCompanyToken={handleGenerateCompanyToken}
        onGenerateWorkerToken={handleGenerateWorkerToken}
        onCopyToken={handleCopyTokenClick}
        tokenLoading={tokenLoading}
      />
    </div>
  );
}
