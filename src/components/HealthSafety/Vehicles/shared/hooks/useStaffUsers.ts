import { useState, useEffect } from 'react';
import { fetchStaff, fetchUsers, fetchCurrentUser, fetchWorkers } from '../utils/dataFetching';
import { combineStaffAndUsers } from '../utils/helpers';
import type { StaffMember, User, Worker, CombinedStaffUser } from '../types';

export const useStaffUsers = (useAllUsers = false) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [combinedStaffUsers, setCombinedStaffUsers] = useState<CombinedStaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [useAllUsers]);

  useEffect(() => {
    // Combine staff, users, and workers when any list changes
    if (staff.length > 0 || users.length > 0 || workers.length > 0) {
      setCombinedStaffUsers(combineStaffAndUsers(staff, users, workers));
    }
  }, [staff, users, workers]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [staffData, workersData] = await Promise.all([
        fetchStaff(),
        fetchWorkers()
      ]);

      const usersData = useAllUsers ? await fetchUsers() : await fetchCurrentUser();

      setStaff(staffData);
      setUsers(usersData);
      setWorkers(workersData);
    } catch (err) {
      console.error('Error fetching staff and users:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  return {
    staff,
    users,
    workers,
    combinedStaffUsers,
    loading,
    error,
    refetch: fetchData
  };
};
