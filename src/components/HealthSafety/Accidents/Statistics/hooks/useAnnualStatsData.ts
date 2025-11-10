import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { ChartData, PeriodType } from '../types';

export const useAnnualStatsData = (periodType: PeriodType) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      let startDate, endDate;
      const today = new Date();

      switch (periodType) {
        case 'calendar':
          startDate = new Date(today.getFullYear(), 0, 1); // Jan 1
          endDate = new Date(today.getFullYear(), 11, 31); // Dec 31
          break;
        case 'fiscal':
          startDate = new Date(today.getFullYear(), 3, 1); // April 1
          endDate = new Date(today.getFullYear() + 1, 2, 31); // March 31
          break;
        case 'rolling':
          endDate = today;
          startDate = new Date(today);
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      // Fetch data from all accident tables
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
            .gte('incident_date', startDate.toISOString())
            .lte('incident_date', endDate.toISOString());

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

  useEffect(() => {
    fetchData();
  }, [periodType]);

  return { data, loading, refetch: fetchData };
};
