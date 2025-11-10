import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { generateReminders, calculateOverdueDrivers, calculateOverdueVehicles } from '../utils/helpers';
import type { DriverWithStaff, Reminder } from '../types';

export const useVehiclesData = (
  onOverdueDriversChange?: (count: number) => void,
  onOverdueVehiclesChange?: (count: number) => void
) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<DriverWithStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Update reminders whenever vehicles or drivers change
    setReminders(generateReminders(vehicles, drivers));

    // Calculate and pass overdue drivers count
    if (onOverdueDriversChange) {
      const overdueDrivers = calculateOverdueDrivers(drivers);
      onOverdueDriversChange(overdueDrivers);
    }

    // Calculate and pass overdue vehicles count
    if (onOverdueVehiclesChange) {
      const overdueItems = calculateOverdueVehicles(vehicles);
      onOverdueVehiclesChange(overdueItems);
    }
  }, [vehicles, drivers, onOverdueDriversChange, onOverdueVehiclesChange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vehiclesResponse, driversResponse] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('drivers')
          .select(
            `
            *,
            staff (
              name
            )
          `
          )
          .order('staff(name)', { ascending: true }),
      ]);

      if (vehiclesResponse.error) throw vehiclesResponse.error;
      if (driversResponse.error) throw driversResponse.error;

      setVehicles(vehiclesResponse.data || []);
      setDrivers(driversResponse.data || []);

      // Calculate overdue vehicles count from reminders
      const overdueItems = calculateOverdueVehicles(vehiclesResponse.data || []);

      if (onOverdueVehiclesChange) {
        onOverdueVehiclesChange(overdueItems);
      }
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

  const deleteVehicle = async (vehicleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;

      await fetchData();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the vehicle'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    drivers,
    reminders,
    loading,
    error,
    fetchData,
    deleteVehicle
  };
};
