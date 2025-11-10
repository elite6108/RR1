import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { AccidentStats, AccidentReport, reportTypeToTable } from '../types';

export const useAccidentStats = () => {
  const [stats, setStats] = useState<AccidentStats>({
    totalReports: 0,
    pendingActions: 0,
    daysSinceLastIncident: 0,
    // Year to date statistics
    sevenDayIncapacitation: 0,
    fatality: 0,
    hospitalTreatment: 0,
    illHealth: 0,
    minorAccident: 0,
    nonFatal: 0,
    occupationalDisease: 0,
    personalInjury: 0,
    specifiedInjuries: 0,
    dangerousOccurrence: 0,
    nearMiss: 0,
    environmental: 0,
    propertyDamage: 0,
    unsafeActions: 0,
    unsafeConditions: 0,
    utilityDamage: 0
  });

  const fetchStats = async () => {
    try {
      // Fetch total reports count
      let totalReports = 0;
      const newStats = { ...stats };
      let allActions: Array<{
        report_id: string;
        table_name: string;
        action_id: string;
      }> = [];
      let allIncidentDates: Date[] = [];

      // Fetch counts for each report type and collect actions
      for (const [type, table] of Object.entries(reportTypeToTable)) {
        const { data, error } = await supabase
          .from(table)
          .select('id, actions')
          .not('actions', 'is', null);

        if (error) throw error;
        
        // Count reports
        const countValue = data?.length || 0;
        totalReports += countValue;
        newStats[type as keyof typeof newStats] = countValue;

        // Collect actions from this table
        if (data) {
          data.forEach((report: AccidentReport) => {
            if (report.actions && Array.isArray(report.actions)) {
              report.actions.forEach((action) => {
                allActions.push({
                  report_id: report.id,
                  table_name: table,
                  action_id: action.id || Math.random().toString()
                });
              });
            }
          });
        }
      }

      // Separately collect incident dates from all tables (without any filters)
      for (const [, table] of Object.entries(reportTypeToTable)) {
        const { data: incidentReports, error: incidentError } = await supabase
          .from(table)
          .select('incident_date')
          .not('incident_date', 'is', null);

        if (incidentError) {
          console.error(`Error fetching incident dates from ${table}:`, incidentError);
          throw incidentError;
        }

        if (incidentReports) {
          incidentReports.forEach((report: { incident_date: string }) => {
            if (report.incident_date) {
              // Handle different date formats more robustly
              const dateStr = report.incident_date.trim();
              let parsedDate: Date;
              
              // Try parsing as ISO string first, then as a general date
              if (dateStr.includes('T') || dateStr.includes('Z')) {
                parsedDate = new Date(dateStr);
              } else {
                // Handle YYYY-MM-DD format or other common formats
                parsedDate = new Date(dateStr + 'T00:00:00.000Z');
              }
              
              // Only add valid dates
              if (!isNaN(parsedDate.getTime())) {
                allIncidentDates.push(parsedDate);
              } else {
                console.warn('Invalid incident date format:', report.incident_date);
              }
            }
          });
        }
      }

      // Fetch completed actions
      const { data: completedActions, error: completedError } = await supabase
        .from('report_actions')
        .select('*')
        .eq('is_completed', true);

      if (completedError) throw completedError;

      // Calculate pending actions by subtracting completed actions
      const completedCount = completedActions?.length || 0;
      const totalActions = allActions.length;
      const pendingActions = totalActions - completedCount;

      // Calculate days since last incident across all tables
      let daysSinceLastIncident = 0;
      if (allIncidentDates.length > 0) {
        // Filter out invalid dates and find the most recent incident date
        const validDates = allIncidentDates.filter(date => date instanceof Date && !isNaN(date.getTime()));
        
        if (validDates.length > 0) {
          const mostRecentIncident = new Date(Math.max(...validDates.map(date => date.getTime())));
          
          // Calculate days difference using UTC to avoid timezone issues
          const now = new Date();
          const nowUTC = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const incidentUTC = new Date(mostRecentIncident.getFullYear(), mostRecentIncident.getMonth(), mostRecentIncident.getDate());
          
          daysSinceLastIncident = Math.max(0, Math.floor((nowUTC.getTime() - incidentUTC.getTime()) / (1000 * 60 * 60 * 24)));
          
          console.log('Days since last incident calculation:', {
            mostRecentIncident: mostRecentIncident.toISOString(),
            nowUTC: nowUTC.toISOString(),
            daysDifference: daysSinceLastIncident,
            totalIncidentDates: allIncidentDates.length,
            validDates: validDates.length
          });
        }
      } else {
        console.log('No incident dates found in any table');
      }

      setStats({
        ...newStats,
        totalReports,
        pendingActions,
        daysSinceLastIncident
      });

    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    // Fetch stats immediately when component mounts
    fetchStats();

    // Set up more frequent polling initially (every 10 seconds for first 2 minutes)
    const initialInterval = setInterval(fetchStats, 10000);
    
    // After 2 minutes, switch to less frequent polling (every minute)
    const switchTimeout = setTimeout(() => {
      clearInterval(initialInterval);
      const regularInterval = setInterval(fetchStats, 60000);
      
      // Store the regular interval for cleanup
      return () => clearInterval(regularInterval);
    }, 120000); // 2 minutes

    // Clean up intervals on unmount
    return () => {
      clearInterval(initialInterval);
      clearTimeout(switchTimeout);
    };
  }, []);

  return { stats, fetchStats };
};
