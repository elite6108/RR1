import React, { useState, useEffect } from 'react';
import { PieChart, LineChart, BarChart, ChevronLeft, Table } from 'lucide-react';
import { supabase } from '../../../../../lib/supabase';
import { HSAccidentsAnnualStatsCharts } from './HSAccidentsAnnualStatsCharts';
import { useAnnualStatsData } from '../hooks/useAnnualStatsData';
import { downloadChart } from '../utils/chartUtils';
import { HSAccidentsAnnualStatsProps, ViewType, PeriodType, ChartPosition, DragState } from '../types';

export function HSAccidentsAnnualStatsMain({ onBack }: HSAccidentsAnnualStatsProps) {
  const [viewType, setViewType] = useState<ViewType>('bar');
  const [periodType, setPeriodType] = useState<PeriodType>('calendar');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState<ChartPosition>({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<DragState>({ 
    isDragging: false, 
    dragStart: { x: 0, y: 0 } 
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const { data, loading } = useAnnualStatsData(periodType);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragState({
      isDragging: true,
      dragStart: {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState.isDragging) {
      setPosition({
        x: e.clientX - dragState.dragStart.x,
        y: e.clientY - dragState.dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragState(prev => ({ ...prev, isDragging: false }));
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Fetch company logo
  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('logo_url')
          .single();

        if (error) throw error;
        if (data?.logo_url) {
          setCompanyLogo(data.logo_url);
        }
      } catch (error) {
        console.error('Error fetching company logo:', error);
      }
    };

    fetchCompanyLogo();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Accidents
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Annual Statistics</h2>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* View Type Toggle - Only show on larger screens */}
        <div className="flex items-center space-x-2 lg:flex hidden">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewType('pie')}
              className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                viewType === 'pie'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <PieChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('line')}
              className={`px-3 py-1 text-sm font-medium ${
                viewType === 'line'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <LineChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('bar')}
              className={`px-3 py-1 text-sm font-medium ${
                viewType === 'bar'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <BarChart className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                viewType === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Table className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Period Type Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Period:</span>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as PeriodType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="calendar">Calendar Year</option>
            <option value="fiscal">Fiscal Year</option>
            <option value="rolling">Rolling 12 Months</option>
          </select>
        </div>

        {/* Chart Controls - Only show for chart views */}
        {viewType !== 'table' && !loading && (
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => {
                setZoomLevel(prev => Math.max(0.5, prev - 0.2));
                setPosition({ x: 0, y: 0 });
              }}
              className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 shadow-md dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              Zoom Out
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.2))}
              className="px-3 py-1 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 shadow-md dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              Zoom In
            </button>
            <button
              onClick={() => downloadChart(companyLogo)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download JPG
            </button>
          </div>
        )}
      </div>

      {/* Main Content Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="p-6">
          <HSAccidentsAnnualStatsCharts
            viewType={viewType}
            data={data}
            loading={loading}
            zoomLevel={zoomLevel}
            position={position}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          />
        </div>
      </div>
    </div>
  );
}
