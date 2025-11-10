import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { ChartData, StatsPeriodType } from '../types';

export const useStatisticsData = (periodType: StatsPeriodType, startDate: string, endDate: string) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const updateDateRange = () => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (periodType) {
      case 'day':
        start.setDate(today.getDate() - 1);
        break;
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case 'custom':
        // Keep existing dates if custom
        return { start: new Date(startDate), end: new Date(endDate) };
    }

    return { start, end };
  };

  const fetchData = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const tables = [
        'accidents_dangerousoccurrence',
        'accidents_fatality',
        'accidents_hospitaltreatment',
        'accidents_illhealth',
        'accidents_minoraccident',
        'accidents_nonfatal',
        'accidents_occupationaldisease',
        'accidents_personalinjury',
        'accidents_sevendayincapacitation',
        'accidents_specifiedinjuries',
        'accidents_nearmiss',
        'accidents_environmental',
        'accidents_propertydamage',
        'accidents_unsafeactions',
        'accidents_unsafeconditions',
        'accidents_utilitydamage'
      ];

      const allData = await Promise.all(
        tables.map(async (table) => {
          const { data, error } = await supabase
            .from(table)
            .select('incident_date')
            .gte('incident_date', start.toISOString())
            .lte('incident_date', end.toISOString());

          if (error) throw error;
          return {
            type: table.replace('accidents_', ''),
            count: data?.length || 0
          };
        })
      );

      setData(allData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      fetchData(new Date(startDate), new Date(endDate));
    }
  };

  useEffect(() => {
    if (periodType !== 'custom') {
      const { start, end } = updateDateRange();
      fetchData(start, end);
    }
  }, [periodType]);

  return { data, loading, fetchData, handleCustomDateChange };
};
