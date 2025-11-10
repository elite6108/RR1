import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { fetchStaff, fetchCurrentUser, fetchWorkers, fetchDrivers } from '../../shared/utils/dataFetching';
import type { Driver, StaffMember, User, Worker } from '../../shared/types';

export const useDriversData = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch drivers, staff, users, and workers
      const [driversResponse, staffData, usersData, workersData] = await Promise.all([
        supabase
          .from('drivers')
          .select('*')
          .order('licence_number', { ascending: true }),
        fetchStaff(),
        fetchCurrentUser(),
        fetchWorkers()
      ]);

      if (driversResponse.error) throw driversResponse.error;

      setDrivers(driversResponse.data || []);
      setStaff(staffData);
      setUsers(usersData);
      setWorkers(workersData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching data'
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (driverId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', driverId);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error deleting driver:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the driver'
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter out staff members who are already drivers
  const availableStaff = staff.filter(
    (staffMember) =>
      !drivers.some((driver) => driver.staff_id === staffMember.id)
  );

  // Check if any users or workers are available (they don't have existing driver records)
  const availableUsers = users.filter(user => 
    !availableStaff.some(staffMember => staffMember.name === user.full_name)
  );

  const availableWorkers = workers;

  // Determine if we have any available people to add as drivers
  const hasAvailablePeople = availableStaff.length > 0 || availableUsers.length > 0 || availableWorkers.length > 0;

  return {
    drivers,
    staff,
    users,
    workers,
    availableStaff,
    availableUsers,
    availableWorkers,
    hasAvailablePeople,
    loading,
    error,
    fetchData,
    deleteDriver
  };
};
